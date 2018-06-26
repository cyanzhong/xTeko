function defaultIcon() {
  var format = 2;
  var scale = $device.info.screen.scale;
  var image = $objc("UIImage").invoke("_applicationIconImageForBundleIdentifier:format:scale:", "", format, scale);
  return image.rawValue();
}

function makeIcon(iconName, color) {

  var length = 180;
  var canvas = $ui.create({ type: "view" });
  canvas.bgcolor = color;
  canvas.frame = $rect(0, 0, length, length);

  canvas.add({
    type: "view",
    props: {
      bgcolor: $color("white"),
      radius: 72,
      frame: $rect(18, 18, 144, 144)
    }
  });

  canvas.add({
    type: "image",
    props: {
      icon: $icon(iconName, color, 72),
      bgcolor: $color("clear"),
      frame: $rect(54, 54, 72, 72)
    }
  })

  return canvas.snapshot;
}

function isIphoneX() {
  return Math.abs($device.info.screen.height - 812.0) < 0.01;
}

function dynamicInsets() {
  var iphoneX = isIphoneX();
  return { left: 0, right: 0, top: (iphoneX ? 22 : 0), bottom: (iphoneX ? 28 : 0) }
}

module.exports = {
  defaultIcon: defaultIcon,
  makeIcon: makeIcon,
  isIphoneX: isIphoneX,
  dynamicInsets: dynamicInsets,
}