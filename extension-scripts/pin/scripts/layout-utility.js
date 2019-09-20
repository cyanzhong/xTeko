function isIphoneX() {
  return Math.abs($device.info.screen.height - 812.0) < 0.01;
}

function dynamicInsets() {
  var iphoneX = isIphoneX();
  return { left: 0, right: 0, top: (iphoneX ? 22 : 0), bottom: (iphoneX ? 28 : 0) }
}

module.exports = {
  isIphoneX: isIphoneX,
  dynamicInsets: dynamicInsets,
}