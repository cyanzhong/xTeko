const utility = require("./utility");
const nativeHeight = $objc("UIScreen").$mainScreen().$nativeBounds().height;
const compactMode = !(nativeHeight == 2688 || nativeHeight == 1792 || $device.isIpad);

exports.compactMode = compactMode;

exports.port = 5050;

exports.touchUpDelay = compactMode ? 0.05 : 0.0;

exports.extendedEdgeInset = (utility.isDebugMode() ? 0 : 24);

exports.btnRadius = 10;

exports.btnMargin = (() => {
  let vec = compactMode ? 5 : 0;
  let margin = 15 - vec;
  return margin;
})();

exports.btnInsetPortrait = (() => {
  let vec = compactMode ? 40 : 0;
  let inset = 120 - exports.btnMargin - vec;
  return inset;
})();

exports.btnInsetLandscape = (() => {
  let inset = 60 - exports.btnMargin;
  return inset;
})();

exports.btnSize = (() => {
  let size = {
    leftRight: $size(50, 40),
    upDown: $size(40, 50),
    ab: $size(50, 40),
  }
  return size;
})();

exports.font = {
  small: $objc("UIFont").$systemFontOfSize(18).rawValue(),
  normal: $font("AvenirNextCondensed-Bold", 20),
  large: $font("AvenirNextCondensed-Bold", 25),
}

exports.color = {
  clear: $color("clear"),
  white: $color("white"),
  black: $color("#030303"),
  red: $color("#d30d18"),
  gray: $color("#525252"),
  keyGray: $color("#bdc1c6"),
}