$photo.pick().then(function(resp) {

  var image = resp.image
  var tintImage = image.runtimeValue().invoke("imageWithRenderingMode", 2).rawValue()
  var side = Math.ceil(72.0 / $device.info.screen.scale)

  var canvas =
  $ui.create({
    type: "image",
    props: {
      image: tintImage,
      bgcolor: $color("clear"),
      tintColor: $color("gray"),
      frame: $rect(0, 0, side, side)
    }
  })

  $quicklook.open({image: canvas.snapshot})
})