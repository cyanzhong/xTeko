$http.get({
  url: "http://clientapi.ipip.net/ip.php?a=location",
  handler: function(resp) {
    var ip = resp.data.ip
    var remote_addr = resp.data.remote_addr
    var loc = resp.data.loc
    $http.get({
      url: "http://myip.hk/",
      handler: function(resp) {
        var regex = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/
        var proxy = regex.exec(resp.data)[1]
        $http.get({
          url: "http://freeapi.ipip.net/" + proxy,
          handler: function(resp) {
            var message = ""
            message += "代理 IP: " + proxy + "\n"
            message += "位置: " + resp.data.join("") + "\n"
            message += "国内 IP: " + ip + "\n"
            message += "位置: " + loc
            $ui.alert(message)
          }
        })
      }
    })  
  }
})