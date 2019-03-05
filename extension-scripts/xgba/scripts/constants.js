const utility = require("./utility");
const nativeHeight = $objc("UIScreen").$mainScreen().$nativeBounds().height;
const compactMode = !(nativeHeight == 2688 || nativeHeight == 1792 || $device.isIpad);

exports.compactMode = compactMode;

exports.port = 4040;

exports.touchUpDelay = compactMode ? 0.05 : 0.0;

exports.btnRadius = 10;

exports.btnMargin = (() => {
  let vec = compactMode ? 5 : 0;
  let margin = 15 - vec;
  return margin;
})();

exports.btnInsetPortrait = (() => {
  let vec = compactMode ? ($device.isIphonePlus ? 10 : 40) : 0;
  let inset = 120 - exports.btnMargin - vec;
  return inset;
})();

exports.btnInsetLandscape = (() => {
  let inset = 60 - exports.btnMargin;
  return inset;
})();

exports.extendedEdgeInset = (utility.isDebugMode() ? 0 : 24);

exports.btnSize = (() => {
  let vec = compactMode ? 10 : 0;
  let size = {
    leftRight: $size(60 - vec, 50 - vec),
    upDown: $size(50 - vec, 60 - vec),
    startSelect: $size(70, 30),
    ab: $size(70 - vec, 70 - vec),
    lr: $size(80, 40),
  }
  return size;
})();

exports.canvasTopInset = (() => {
  let vec = compactMode ? 40 : 0;
  let inset = 60 - vec;
  return inset;
})();

exports.canvasBottomInset = (() => {
  let vec = compactMode ? exports.btnMargin * 3 : exports.btnMargin * 2;
  let inset = exports.btnSize.startSelect.height + exports.extendedEdgeInset + vec;
  return inset;
})();

exports.magicTouchHeight = (() => {
  return compactMode ? 60 : 0;
})();

exports.font = {
  normal: $font("AvenirNextCondensed-Bold", 20),
  medium: $font(24),
  large: $font("AvenirNextCondensed-Bold", 32),
}

exports.color = {
  clear: $color("clear"),
  white: $color("white"),
  black: $color("#030303"),
  gray: $color("#525252"),
  lightGray: $color("#F0F0F0"),
  red: $color("#d30d18"),
}