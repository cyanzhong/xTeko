$ui.loading(true)
$http.get({
  url: "http://api.ineal.me/tss/all",
  handler: function(resp) {
    $ui.loading(false)
    next(resp.data["iPhone9,2"].firmwares)
  }
})

function next(result) {
  var Version = result[0].version
  for (var i = 1; i < result.length; i++) {
    var data = result[i].version
    var Version = Version + "," + data
  }
  var mine = $device.info.version
  var match = Version.match(mine)[0]
  if (match === mine) {
    output(mine + " (可以验证)", Version)
  } else {
    output(mine + " (验证已关)", Version)
  }
}

function output(information, Version) {
  $ui.alert({
    title: "•••【温馨提示】•••",
    message: "当前固件：" + information + "\n可验证固件：" + Version
  })
}