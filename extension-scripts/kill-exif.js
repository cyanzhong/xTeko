$app.strings = {
  "en": {
    "export-as": "Export as"
  },
  "zh-Hans": {
    "export-as": "导出为"
  },
  "zh-Hant": {
    "export-as": "導出為"
  },
}

var image = $context.image

if (image) {
  $thread.main({
    delay: 0.3,
    handler: function() {
      killExif(image)
    }
  })
  return
}

$photo.pick({
  handler: function(resp) {
    var image = resp.image
    if (image) {
      killExif(image)
    }
  }
})

function killExif(image) {
  $ui.menu({
    items: ["JPEG", "PNG"].map(function(item) { return $l10n("export-as") + " " + item }),
    handler: function(title, idx) {
      $share.sheet(idx == 0 ? image.jpg(1.0) : image.png)
    }
  })
}