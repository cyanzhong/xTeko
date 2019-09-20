var calc = require('./calc')
var cover = require('./cover')
var wid = $device.info.screen.width
var hig = $device.info.screen.height
var file = $file.read("vendor/palette/setting.conf")
var SETTING_ = JSON.parse(file.string)

var RGB = {
  type: "view",
  layout: $layout.fill,
  views: [{
      type: "label",
      props: {
        font: $font(13),
        text: "Red",
      },
      layout: function(make, view) {
        make.top.equalTo(view.super)
        make.left.equalTo(view.super).offset(50)
      }
    }, {
      type: "label",
      props: {
        font: $font(13),
        text: "Green",
      },
      layout: function(make, view) {
        make.top.equalTo(view.super).offset(45)
        make.left.equalTo(view.super).offset(50)
      }
    }, {
      type: "label",
      props: {
        font: $font(13),
        text: "Blue",
      },
      layout: function(make, view) {
        make.top.equalTo(view.super).offset(90)
        make.left.equalTo(view.super).offset(50)
      }
    }, //==========R==========
    {
      type: "view",
      layout: function(make, view) {
        make.top.equalTo(view.super).offset(15)
        make.size.equalTo($size(wid, 30))
      },
      views: [{
        type: "label",
        props: {
          id: "r_v",
          font: $font(13),
          text: $cache.get("r"),
          align: $align.right
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.right.equalTo(view.super).offset(-wid + 33)
        }
      }, {
        type: "gradient",
        props: {
          id: "r_grad",
          radius: 2,
          borderWidth: 0.2,
          borderColor: $color("#C3C3C3"),
          //colors: [$color("black"), $color("red")],
          locations: [0.0, 1.0],
          startPoint: $point(0, 1),
          endPoint: $point(1, 1)
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.prev)
          make.centerX.equalTo(view.super).offset(10)
          make.size.equalTo($size(wid - 80, 4))
        }
      }, {
        type: "slider",
        props: {
          id: "r_slider",
          value: $cache.get("r") / 255,
          minColor: $color("clear"),
          maxColor: $color("clear")
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.centerX.equalTo(view.super).offset(10)
          make.width.equalTo(wid - 80)
        },
        events: {
          changed: function(sender) {
            $("r_v").text = Math.ceil(sender.value * 255)
            cview()
            cover.r_cover(sender.value*255)
          }
        }
      }]
    }, //==========G==========
    {
      type: "view",
      layout: function (make, view) {
        make.top.equalTo(view.prev).offset(45)
        make.size.equalTo($size(wid, 30))
      },
      views: [{
        type: "label",
        props: {
          id: "g_v",
          font: $font(13),
          text: $cache.get("g"),
          align: $align.right
        },
        layout: function (make, view) {
          make.centerY.equalTo(view.super)
          make.right.equalTo(view.super).offset(-wid + 33)
        }
      }, {
        type: "gradient",
        props: {
          id: "g_grad",
          radius: 2,
          borderWidth: 0.2,
          borderColor: $color("#C3C3C3"),
          //colors: [$color("black"), $color("green")],
          locations: [0.0, 1.0],
          startPoint: $point(0, 1),
          endPoint: $point(1, 1)
        },
        layout: function (make, view) {
          make.centerY.equalTo(view.prev)
          make.centerX.equalTo(view.super).offset(10)
          make.size.equalTo($size(wid - 80, 4))
        }
      }, {
        type: "slider",
        props: {
          id: "g_slider",
          value: $cache.get("g") / 255,
          minColor: $color("clear"),
          maxColor: $color("clear")
        },
        layout: function (make, view) {
          make.centerY.equalTo(view.super)
          make.centerX.equalTo(view.super).offset(10)
          make.width.equalTo(wid - 80)
        },
        events: {
          changed: function (sender) {
            $("g_v").text = Math.ceil(sender.value * 255)
            cview()
            cover.g_cover(sender.value*255)
          }
        }
      }]
    },  //==========B==========
    {
      type: "view",
      layout: function (make, view) {
        make.top.equalTo(view.prev).offset(45)
        make.size.equalTo($size(wid, 30))
      },
      views: [{
        type: "label",
        props: {
          id: "b_v",
          font: $font(13),
          text: $cache.get("b"),
          align: $align.right
        },
        layout: function (make, view) {
          make.centerY.equalTo(view.super)
          make.right.equalTo(view.super).offset(-wid + 33)
        }
      }, {
        type: "gradient",
        props: {
          id: "b_grad",
          radius: 2,
          borderWidth: 0.2,
          borderColor: $color("#C3C3C3"),
          //colors: [$color("black"), $color("blue")],
          locations: [0.0, 1.0],
          startPoint: $point(0, 1),
          endPoint: $point(1, 1)
        },
        layout: function (make, view) {
          make.centerY.equalTo(view.prev)
          make.centerX.equalTo(view.super).offset(10)
          make.size.equalTo($size(wid - 80, 4))
        }
      }, {
        type: "slider",
        props: {
          id: "b_slider",
          value: $cache.get("b") / 255,
          minColor: $color("clear"),
          maxColor: $color("clear")
        },
        layout: function (make, view) {
          make.centerY.equalTo(view.super)
          make.centerX.equalTo(view.super).offset(10)
          make.width.equalTo(wid - 80)
        },
        events: {
          changed: function (sender) {
            $("b_v").text = Math.ceil(sender.value * 255)
            cview()
            cover.b_cover(sender.value*255)
          }
        }
      }]
    }
  ]
}

function cview() {
  var color = calc.RGB2HEX($("r_v").text, $("g_v").text, $("b_v").text)
  var hex = "#" + color
  var rgb = "(" + $("r_v").text + "," + $("g_v").text + "," + $("b_v").text + ")"
  $cache.set("hex",hex)
  $("pview").bgcolor = $color(hex)
  $("hex_v").text = hex
  $("rgb_v").text = rgb
  sethsvvalue()
}

function sethsvvalue() {
  hsv_ = calc.HEX2HSV($("hex_v").text)[0]
  $("h_v").text = hsv_[0]
  $("h_slider").value = hsv_[0] / 360
  $("h_cover1").alpha = 1 - hsv_[1] / 100
  $("h_cover2").alpha = 1 - hsv_[2] / 100

  $("s_v").text = hsv_[1]
  $("s_slider").value = hsv_[1] / 100
  $("s_cover").alpha = 1-hsv_[2] / 100

  $("v_v").text = hsv_[2]
  $("v_slider").value = hsv_[2] / 100
  zero()
}

function zero() {
  if ($("r_v").text === "0" && $("g_v").text === "0" && $("b_v").text === "0") {
    cover.cover("h_cover2", "black", 0)
    cover.cover("s_cover", "black", 0)
    $("v_grad").colors = [$color("black"), $color("red")]
    $("v_cover").alpha = 1
    $("h_slider").userInteractionEnabled = false
    $("s_slider").userInteractionEnabled = false
    $("v_slider").value = 0
  } else if ($("r_v").text === "255" && $("g_v").text === "255" && $("b_v").text === "255") {
    cover.cover("h_cover1", "white", 0)
    $("s_grad").colors = [$color("white"), $color("red")]
    $("v_grad").colors = [$color("black"), $color("red")]
    //$("h_cover1").alpha = 1
    //$("h_cover2").alpha = 0
    $("v_cover").alpha = 1
    $("h_slider").userInteractionEnabled = false
  } else {
    if ($("s_v").text === "0") {
      $("h_slider").userInteractionEnabled = false
      $("s_slider").userInteractionEnabled = true
    } else {
      $("h_slider").userInteractionEnabled = true
      $("s_slider").userInteractionEnabled = true
    }
  }
}

module.exports = {
  RGB: RGB,
  sethsvvalue: sethsvvalue
}