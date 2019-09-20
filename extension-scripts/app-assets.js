var regex = /.+id(\d+).*/
var match = regex.exec($context.link || $clipboard.link)
var appid = match[1]

if (appid) {
  lookup(appid)
}

function lookup(appid) {
  $http.get({
    url: "https://itunes.apple.com/lookup?id=" + appid,
    handler: function(resp) {
      $ui.menu({
        items: ["高清图标", "iPhone 截图", "iPad 截图"],
        handler: function(title, idx) {
          var result = resp.data.results[0]
          if (idx == 0) {
            var url = result.artworkUrl512.replaceAll("512", "1024")
            if (url) {
              $quicklook.open({url: url})
            }
          } else {
            var urls = idx == 1 ? result.screenshotUrls : result.ipadScreenshotUrls
            $quicklook.open({list: urls})
          }
        }
      })
    }
  })
}

String.prototype.replaceAll = function(key, replacement) {
  return this.replace(new RegExp(key, 'g'), replacement)
}