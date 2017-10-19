$app.strings = {
  "en": {
    "hint": "Enter margin, defaults to 0"
  },
  "zh-Hans": {
    "hint": "输入间距，默认为 0"
  },
  "zh-Hant": {
    "hint": "輸入間距，默認為 0"
  }
}

$photo.pick({
  multi: true,
  handler: function(resp) {
    if (resp.results.length > 0) {
      $input.text({
        type: $kbType.decimal,
        placeholder: $l10n("hint"),
        handler: function(text) {
          concat(resp.results, Number(text))
        }
      })
    }
  }
})

function concat(results, margin) {

  var canvas = $ui.create({type: "view"})
  var canvasWidth = $device.info.screen.width
  var canvasHeight = 0

  for (var idx=0; idx<results.length; ++idx) {
    var image = results[idx].image
    var imageWidth = canvasWidth
    var imageHeight = image.size.height / image.size.width * canvasWidth
    canvas.add({
      type: "image",
      props: {
        image: image,
        frame: $rect(0, canvasHeight, imageWidth, imageHeight)
      }
    })
    canvasHeight += imageHeight + margin
  }
  
  canvas.frame = $rect(0, 0, canvasWidth, canvasHeight)
  var snapshot = canvas.snapshot
  $share.sheet(snapshot)
}