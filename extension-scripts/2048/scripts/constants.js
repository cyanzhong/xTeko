var builder = require("./builder");

var colors = {
  white: builder.color("#ffffff"),
  backgroud: builder.color("#faf8ef"),
  darkGray: builder.color("#bbada0"),
  gray: builder.color("#ccc0b4"),
  lightGray: builder.color("#eee4da"),
  darkText: builder.color("#776e65"),
  lightText: builder.color("#776e65"),
  orange: builder.color("#f99556"),
};

var fontNames = {
  markerFeltWide: "MarkerFelt-Wide",
  lato: "Lato",
};

var insets = 15;

module.exports = {
  colors: colors,
  fontNames: fontNames,
  insets: insets,
}