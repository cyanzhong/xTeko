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
      var url = resp.data.results[0].artworkUrl512.replaceAll("512", "1024")
      if (url) {
        download(url)
      }
    }
  })
}

function download(url) {
  $ui.loading(true)
  $http.download({
    url: url,
    handler: function(resp) {
      $ui.loading(false)
      $share.sheet(resp.data)
    }
  })
}

String.prototype.replaceAll = function(key, replacement) {
  return this.replace(new RegExp(key, 'g'), replacement)
}