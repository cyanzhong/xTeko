const compactMode = !$device.isIphoneX && !$device.isIpad;

exports.btnRadius = 10;

exports.btnMargin = (() => {
  let vec = compactMode ? 5 : 0;
  let margin = 15 - vec;
  return margin;
})();

exports.bottomInset = (() => {
  let vec = compactMode ? 10 : 0;
  let inset = 40 - vec;
  return inset;
})();

exports.btnSize = (() => {
  let vec = compactMode ? 10 : 0;
  let size = {
    leftRight: $size(60 - vec, 50 - vec),
    upDown: $size(50 - vec, 60 - vec),
    startSelect: $size(80 - vec, 40 - vec),
    ab: $size(70 - vec, 70 - vec),
  }
  return size;
})()

exports.font = {
  normal: $font(16),
  large: $font(32),
}

exports.color = {
  clear: $color("clear"),
  black: $color("#030303"),
  gray: $color("#525252"),
  lightGray: $color("#F0F0F0"),
  red: $color("#d30d18"),
}