function randomWord(randomFlag, min, max) {
  var str = ""
  var range = min
  var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  for (var i = 0; i < range; i++) {
    var pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}
var roomId = '20360'
var did = randomWord(false, 32).toUpperCase()
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
      if (data.data && data.data.hls_url) { //&& false
        var hls_url = data.data.hls_url
        $app.openURL(hls_url.replace('http://', 'https://'))
      } else if (data.data && data.data.rtmp_url && data.data.rtmp_live) {
        var flv = data.data.rtmp_url + '/' + data.data.rtmp_live;
        $app.openURL('nplayer-' + flv.replace('http://', 'https://'))
      } else {
        $ui.toast('No URL')
      }
    } else {
      $ui.toast('Not Online')
    }
  }
})
