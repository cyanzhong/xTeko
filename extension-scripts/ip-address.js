var options = [
  { name: "ip.cn", url: "http://ip.cn" },
  { name: "ipify.org", url: "https://api.ipify.org" }
]

$ui.menu({
  items: options.map(function(item) { return item.name }),
  handler: function(title, idx) {
    var option = options[idx]
    $http.get({
      url: option.url,
      header: { "User-Agent": "curl/1.0" },
      handler: function(resp) {
        $ui.alert(resp.data)
      }
    })
  }
})
