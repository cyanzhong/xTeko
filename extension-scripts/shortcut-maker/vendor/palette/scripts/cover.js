var calc = require('./calc')

//------------------HSV界面颜色控制------------------
function gets_c(date) {
  //获取H、S值为100%时S、V右侧颜色
  s_cc = "#" + calc.HSV2HEX(date, 100, 100)[0]
  s_c = s_cc.replace(/,/g, "")
  return s_c
}

function cover(id, color, value) {
  //控制覆盖条黑白及alpha值
  if ($("v_v").text === "0") {
    $([id]).bgcolor = $color("black")
  } else {
    $([id]).bgcolor = $color(color)
  }
  $([id]).alpha = 1 - value
}

function h_cover(data) {
  //H条颜色控制、数值变化
  var n = Math.ceil(data * 360)
  $("s_grad").colors = [$color("white"), $color(gets_c(n))]
  $("v_grad").colors = [$color("black"), $color(gets_c(n))]
  rgb_cover()
}

function s_cover(data) {
  //S条颜色控制、数值变化
  var n = Math.ceil(data * 100)
//控制H、S控制条
  if (data === 0) {
    $("s_grad").colors = [$color("white"), $color("red")]
    $("v_grad").colors = [$color("black"), $color("red")]
    $("h_cover1").alpha = 1
    $("h_cover2").alpha = 0
    $("v_cover").alpha = 1
    $("h_slider").value = 0
    $("h_v").text = 0
    cover("h_cover2", $("hex_v").text, $("v_v").text / 100)
    $("h_slider").userInteractionEnabled = false
  } else {
    cover("h_cover1", "white", $("s_v").text / 100)
    cover("h_cover2", "black", $("v_v").text / 100)
    $("v_cover").alpha = 1 - $("s_v").text / 100
    $("h_slider").userInteractionEnabled = true
  }
  rgb_cover()
}

function v_cover(data) {
  //V条颜色控制、数值变化
  var n = Math.ceil(data * 100)
  //控制H、S控制条
  if (data === 0) {
    //cover("h_cover2", "black", 0)
    cover("s_cover", "black", 0)
    $("h_v").text = 0
    $("s_v").text = 0
    $("s_grad").colors = [$color("white"), $color("red")]
    $("v_grad").colors = [$color("black"), $color("red")]
    $("v_cover").alpha = 1
    $("h_slider").value = 0
    $("h_slider").userInteractionEnabled = false
    $("s_slider").value = 0
    $("s_slider").userInteractionEnabled = false
  } else {
    if ($("s_v").text === "0") {
      cover("h_cover2", $("hex_v").text, $("v_v").text / 100)
      $("h_slider").userInteractionEnabled = false
      cover("s_cover", "black", $("v_v").text / 100)
      $("s_slider").userInteractionEnabled = true
    } else {
      cover("h_cover1", "white", $("s_v").text / 100)
      cover("h_cover2", "black", $("v_v").text / 100)
      $("h_slider").userInteractionEnabled = true
      cover("s_cover", "black", $("v_v").text / 100)
      $("s_slider").userInteractionEnabled = true
    }
  }
  rgb_cover()
}

function rgb_cover() {
  var reg = /\w{2}/g
  HEX = ($("hex_v").text).match(reg)
  R = Math.ceil("0x" + HEX[0], 16)
  G = Math.ceil("0x" + HEX[1], 16)
  B = Math.ceil("0x" + HEX[2], 16)

  r_l = "#" + calc.RGB2HEX(0, G, B)
  r_r = "#" + calc.RGB2HEX(255, G, B)
  g_l = "#" + calc.RGB2HEX(R, 0, B)
  g_r = "#" + calc.RGB2HEX(R, 255, B)
  b_l = "#" + calc.RGB2HEX(R, G, 0)
  b_r = "#" + calc.RGB2HEX(R, G, 255)

  $("r_grad").colors = [$color(r_l), $color(r_r)]
  $("g_grad").colors = [$color(g_l), $color(g_r)]
  $("b_grad").colors = [$color(b_l), $color(b_r)]
}
//------------------RGB界面颜色控制------------------
function r_cover(date) {
  r_l = "#" + calc.RGB2HEX(0, $("g_v").text, $("b_v").text)
  r_r = "#" + calc.RGB2HEX(255, $("g_v").text, $("b_v").text)
  g_l = "#" + calc.RGB2HEX(date, 0, $("b_v").text)
  g_r = "#" + calc.RGB2HEX(date, 255, $("b_v").text)
  b_l = "#" + calc.RGB2HEX(date, $("g_v").text, 0)
  b_r = "#" + calc.RGB2HEX(date, $("g_v").text, 255)

  $("r_grad").colors = [$color(r_l), $color(r_r)]
  $("g_grad").colors = [$color(g_l), $color(g_r)]
  $("b_grad").colors = [$color(b_l), $color(b_r)]

  //计算当前选择颜色的HEX
  rgb = "#" + calc.RGB2HEX(date, $("g_v").text, $("b_v").text)
  let cc = ((calc.HEX2HSV(rgb))[0])[0]
  $("v_grad").colors = [$color("black"), $color(gets_c(cc))];
  $("s_grad").colors = [$color("white"), $color(gets_c(cc))]

}

function g_cover(date) {
  r_l = "#" + calc.RGB2HEX(0, date, $("b_v").text)
  r_r = "#" + calc.RGB2HEX(255, date, $("b_v").text)
  g_l = "#" + calc.RGB2HEX($("r_v").text, 0, $("b_v").text)
  g_r = "#" + calc.RGB2HEX($("r_v").text, 255, $("b_v").text)
  b_l = "#" + calc.RGB2HEX($("r_v").text, date, 0)
  b_r = "#" + calc.RGB2HEX($("r_v").text, date, 255)

  $("r_grad").colors = [$color(r_l), $color(r_r)]
  $("g_grad").colors = [$color(g_l), $color(g_r)]
  $("b_grad").colors = [$color(b_l), $color(b_r)]

  //计算当前选择颜色的HEX
  rgb = "#" + calc.RGB2HEX($("r_v").text, date, $("b_v").text)
  let cc = ((calc.HEX2HSV(rgb))[0])[0]
  $("s_grad").colors = [$color("white"), $color(gets_c(cc))];
  $("v_grad").colors = [$color("black"), $color(gets_c(cc))]

}

function b_cover(date) {
  r_l = "#" + calc.RGB2HEX(0, $("g_v").text, date)
  r_r = "#" + calc.RGB2HEX(255, $("g_v").text, date)
  g_l = "#" + calc.RGB2HEX($("r_v").text, 0, date)
  g_r = "#" + calc.RGB2HEX($("r_v").text, 255, date)
  b_l = "#" + calc.RGB2HEX($("r_v").text, $("g_v").text, 0)
  b_r = "#" + calc.RGB2HEX($("r_v").text, $("g_v").text, 255)

  $("r_grad").colors = [$color(r_l), $color(r_r)]
  $("g_grad").colors = [$color(g_l), $color(g_r)]
  $("b_grad").colors = [$color(b_l), $color(b_r)]

  //计算当前选择颜色的HEX
  rgb = "#" + calc.RGB2HEX($("r_v").text, $("g_v").text, date)
  let cc = ((calc.HEX2HSV(rgb))[0])[0]
  $("s_grad").colors = [$color("white"), $color(gets_c(cc))];
  $("v_grad").colors = [$color("black"), $color(gets_c(cc))]
}

module.exports = {
  gets_c: gets_c,
  cover:cover,
  h_cover: h_cover,
  s_cover: s_cover,
  v_cover: v_cover,
  r_cover: r_cover,
  g_cover: g_cover,
  b_cover: b_cover,
  rgb_cover: rgb_cover
}