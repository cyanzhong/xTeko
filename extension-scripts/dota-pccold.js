$http.get({
  url: "https://api.maxjia.com/api/live/list/",
  handler: function(resp) {
    var data = resp.data
    if (!data) {
      $ui.alert('API返回为空，检查网络')
      return
    }
    var results = data.result
    if (!results) {
      $ui.alert('API返回为空')
      return
    }
    var online = false
    var url = null
    results.forEach(function(live) {
      var live_id = live.live_id
      if (live_id == '20360') { // 20360 for Pc冷冷
        online = true
        var url_info = live.url_info
        if (url_info && url_info.url) {
          url = url_info.url
        }
        return true
      }
    })
    if (!online) {
      $ui.alert('未在 DotA 区上线')
    } else {
      if (!url) {
        $ui.alert('没有 URL')
        return
      }
      $http.get({
        url: url,
        handler: function(resp) {
          var data = resp.data
          // For rtmp flv, please check the API response
          // flv can be streamed by vlc , and not expire
          // Here simply redirect to hls_url, which could expire
          if (data.data && data.data.hls_url) {
            $app.openURL(data.data.hls_url)
          } else {
            $ui.alert('没有 HLS 链接')
          }
        }
      })
    }
  }
})
