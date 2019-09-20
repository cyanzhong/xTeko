function getIcon(item) {
  showDownloading()
  $quicklook.open({ url: item.artworkUrl100.replaceAll("100x100", "1024x1024") })
}

function getScreenshots(item) {
  showDownloading()
  $quicklook.open({ list: item.screenshotUrls.map(function(url){
    return url.replaceAll(/\d+x\d+/, "2400x2400")
  })})
}

function getIpadScreenshots(item) {
  showDownloading()
  $quicklook.open({ list: item.ipadScreenshotUrls.map(function(url){
    return url.replaceAll(/\d+x\d+/, "2400x2400")
  })})
}

function showDetails(item) {
  require("scripts/detail").show(item)
}

function openAppStore(country, item) {
  $app.openURL(`https://itunes.apple.com/${country.code}/app/id${item.trackId}`)
}

function openCollection(item) {
  $app.openURL(item.collectionViewUrl)
}

function openArtistView(item) {
  $app.openURL(item.artistViewUrl)
}

function openTrackView(item) {
  $app.openURL(item.trackViewUrl)
}

function openPreview(item) {
  $app.openURL(item.previewUrl)
}

function showDownloading() {
  $ui.toast($l10n("DOWNLOADING"))
}

module.exports = {
  getIcon: getIcon,
  getScreenshots: getScreenshots,
  getIpadScreenshots: getIpadScreenshots,
  showDetails: showDetails,
  openAppStore: openAppStore,
  openCollection: openCollection,
  openArtistView: openArtistView,
  openTrackView: openTrackView,
  openPreview: openPreview,
}