const compactMode = !$device.isIphoneX && !$device.isIpad;

exports.port = 1010;

exports.touchUpDelay = compactMode ? 0.05 : 0.0;

exports.btnRadius = 10;

exports.btnMargin = (() => {
  let vec = compactMode ? 5 : 0;
  let margin = 15 - vec;
  return margin;
})();

exports.btnInset = (() => {
  let vec = compactMode ? 10 : 0;
  let inset = 40 - exports.btnMargin - vec;
  return inset;
})();

exports.btnSize = (() => {
  let vec = compactMode ? 10 : 0;
  let size = {
    leftRight: $size(60 - vec, 50 - vec),
    upDown: $size(50 - vec, 60 - vec),
    startSelect: $size(70, 30),
    ab: $size(70 - vec, 70 - vec),
  }
  return size;
})()

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