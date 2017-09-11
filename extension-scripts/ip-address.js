$ui.menu({
  items: ["ip.cn", "ipify.org"],
  handler: function(title, idx) {
    if (idx===0) {
      $http.post({
        url: "http://ip.cn",
        header: {
          "User-Agent": "curl/1.0"
        },
        handler: function(resp) {
          $ui.alert(resp.data)
        }
      })
    } else {
      $http.get({
        url: "https://api.ipify.org",
        handler: function(resp) {
          $ui.alert(resp.data)
        }
      })
    }
  }
})
