var model = $device.info.model

$ui.loading(true)
$http.get({
  url: "http://api.ineal.me/tss/all",
  handler: function(resp) {
    var versions = resp.data[model].firmwares.map(function(item) { return item.version })
    match(versions.join(", "))
  }
})

function match(versions) {
  var mine = $device.info.version
  $http.get({
    url: "https://api.ipsw.me/v2.1/" + model + "/" + mine + "/info.json",
    handler: function(resp) {
      $ui.loading(false)
      output(mine + (resp.data.signed ? " (可以验证)" : " (不可验证)"), versions)
    }
  })
}

function output(information, versions) {
  $ui.alert({
    title: "•••【温馨提示】•••",
    message: "当前固件：" + information + "\n可验证固件：" + versions
  })
}