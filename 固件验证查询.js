$http.get({
  url: "http://api.ineal.me/tss/all",
  handler: function(resp) {
    next(resp.data["iPhone9,2"].firmwares)
  }
})

function next(result) {
  var Version = result[0].version
  for (var i = 1; i < result.length; i++) {
    var Version = Version + "," + result[i].version
  }
  match(Version)
}

function match(Version) {
  var mine = $device.info.version
  $http.get({
    url: "https://api.ipsw.me/v2.1/iphone9,2/" + mine + "/info.json",
    handler: function(resp) {
      var data = resp.data.signed
      if (data === 1) {
        output(mine + " (可以验证)", Version)
      } else {
        output(mine + " (不可验证)", Version)
      }
    }
  })
}

function output(information, Version) {
  $ui.alert({
    title: "•••【温馨提示】•••",
    message: "当前固件：" + information + "\n可验证固件：" + Version
  })
}
