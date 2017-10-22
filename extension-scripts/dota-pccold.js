var roomId = '20360'
var tt = (new Date()).getTime().toString().substr(0, 10)
var apikey = 'Y237pxTx2In5ayGz'
var authstr = "room/" + roomId + "?aid=androidhd1&cdn=ws&client_sys=android&time=" + tt
var authstr1 = authstr + apikey
var sign = $text.MD5(authstr1)
//CryptoJS.MD5(authstr1).toString()
var apiurl = "https://capi.douyucdn.cn/api/v1/" + authstr + "&auth=" + sign

$http.get({
  url: apiurl,
  handler: function(resp) {
    var data = resp.data
    if (!data.error) {
      if(data.data.online || data.data.show_status == 1){
        if (data.data && data.data.hls_url) { //&& false
          var hls_url = data.data.hls_url
          $app.openURL(hls_url.replace('http://', 'https://'))
        } else if (data.data && data.data.rtmp_url && data.data.rtmp_live) {
          var flv = data.data.rtmp_url + '/' + data.data.rtmp_live;
          $app.openURL('nplayer-' + flv.replace('http://', 'https://'))
        } else {
          $ui.toast('No URL')
        }
      }else{
        $ui.toast('Not Online')
      }
    } else {
      $ui.toast('Not Online')
    }
  }
})
