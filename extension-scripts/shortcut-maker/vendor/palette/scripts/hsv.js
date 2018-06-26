var calc = require('./calc')
var cover = require('./cover')
var wid = $device.info.screen.width
var hig = $device.info.screen.height
var file = $file.read("vendor/palette/setting.conf")
var SETTING_ = JSON.parse(file.string)

var HSV = {
  type: "view",
  layout: $layout.fill,
  views: [{
      type: "label",
      props: {
        font: $font(13),
        text: "Hue",
      },
      layout: function(make, view) {
        make.top.equalTo(view.super)
        make.left.equalTo(view.super).offset(50)
      }
    }, {
      type: "label",
      props: {
        font: $font(13),
        text: "Saturation",
      },
      layout: function(make, view) {
        make.top.equalTo(view.super).offset(45)
        make.left.equalTo(view.super).offset(50)
      }
    }, {
      type: "label",
      props: {
        font: $font(13),
        text: "Brightness",
      },
      layout: function(make, view) {
        make.top.equalTo(view.super).offset(90)
        make.left.equalTo(view.super).offset(50)
      }
    },
    //==========H==========
    {
      type: "view",
      layout: function(make, view) {
        make.top.equalTo(view.super).offset(15)
        make.size.equalTo($size(wid, 30))
      },
      views: [{
        type: "label",
        props: {
          id: "h_v",
          font: $font(13),
          text: SETTING_[0],
          align: $align.right
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.right.equalTo(view.super).offset(-wid + 33)
        }
      }, {
        type: "label",
        props: {
          font: $font(13),
          text: "°"
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.left.equalTo(view.prev.right)
        }
      }, {
        type: "gradient",
        props: {
          radius: 2,
          borderWidth: 0.2,
          borderColor: $color("#C3C3C3"),
          colors: [$color("#FF0000"), $color("#FFFF00"), $color("#00FF00"), $color("#00FFFF"), $color("#0000FF"), $color("#FF00FF"), $color("#FF0000")],
          locations: [0.0, 0.125, 0.25, 0.5, 0.75, 0.875, 1.0],
          startPoint: $point(0, 1),
          endPoint: $point(1, 1)
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.centerX.equalTo(view.super).offset(10)
          make.size.equalTo($size(wid - 80, 4))
        }
      }, {
        type: "view",
        props: {
          id: "h_cover1",
          radius: 2,
          borderWidth: 0.2,
          borderColor: $color("#C3C3C3"),
          bgcolor: $color("white"),
          alpha: 1 - SETTING_[1] / 100
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.centerX.equalTo(view.super).offset(10)
          make.size.equalTo($size(wid - 80, 4))
        }
      }, {
        type: "view",
        props: {
          id: "h_cover2",
          radius: 2,
          borderWidth: 0.2,
          borderColor: $color("#C3C3C3"),
          bgcolor: $color("black"),
          alpha: 1 - SETTING_[2] / 100
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.centerX.equalTo(view.super).offset(10)
          make.size.equalTo($size(wid - 80, 4))
        }
      }, {
        type: "slider",
        props: {
          id: "h_slider",
          value: SETTING_[0] / 360,
          minColor: $color("clear"),
          maxColor: $color("clear"),
          userInteractionEnabled: SETTING_[1] == 0 ? false : true
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.centerX.equalTo(view.super).offset(10)
          make.width.equalTo(wid - 80)
        },
        events: {
          changed: function(sender) {
            $("h_v").text = Math.ceil(sender.value * 360)
            cview()
            cover.h_cover(sender.value)
          }
        }
      }]
    },
    //==========S==========
    {
      type: "view",
      layout: function(make, view) {
        make.top.equalTo(view.prev).offset(45)
        make.size.equalTo($size(wid, 30))
      },
      views: [{
        type: "label",
        props: {
          id: "s_v",
          font: $font(13),
          text: SETTING_[1]
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.right.equalTo(view.super).offset(-wid + 30)
        }
      }, {
        type: "label",
        props: {
          font: $font(13),
          text: "%"
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.left.equalTo(view.prev.right)
        }
      }, {
        type: "gradient",
        props: {
          id: "s_grad",
          radius: 2,
          borderWidth: 0.2,
          borderColor: $color("#C3C3C3"),
          colors: [$color("white"), $color(s_right())],
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
        type: "view",
        props: {
          id: "s_cover",
          radius: 2,
          borderWidth: 0.2,
          borderColor: $color("#C3C3C3"),
          bgcolors: $color("white"),
          alpha: 1 - SETTING_[2] / 100
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.centerX.equalTo(view.super).offset(10)
          make.size.equalTo($size(wid - 80, 4))
        }
      }, {
        type: "slider",
        props: {
          id: "s_slider",
          value: SETTING_[1] / 100,
          minColor: $color("clear"),
          maxColor: $color("clear"),
          userInteractionEnabled: SETTING_[2] == 0 ? false : true
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.prev)
          make.centerX.equalTo(view.super).offset(10)
          make.width.equalTo(wid - 80)
        },
        events: {
          changed: function(sender) {
            $("s_v").text = Math.ceil(sender.value * 100)
            cview()
            cover.s_cover(sender.value)
          }
        }
      }]
    },
    //==========V==========
    {
      type: "view",
      layout: function(make, view) {
        make.top.equalTo(view.prev).offset(45)
        make.size.equalTo($size(wid, 30))
      },
      views: [{
        type: "label",
        props: {
          id: "v_v",
          font: $font(13),
          text: SETTING_[2]
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.right.equalTo(view.super).offset(-wid + 30)
        }
      }, {
        type: "label",
        props: {
          font: $font(13),
          text: "%"
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.left.equalTo(view.prev.right)
        }
      }, {
        type: "gradient",
        props: {
          id: "v_grad",
          radius: 2,
          borderWidth: 0.2,
          borderColor: $color("#C3C3C3"),
          colors: [$color("black"), $color(s_right())],
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
        type: "gradient",
        props: {
          id: "v_cover",
          radius: 2,
          borderWidth: 0.2,
          borderColor: $color("#C3C3C3"),
          colors: [$color("black"), $color("white")],
          locations: [0.0, 1.0],
          startPoint: $point(0, 1),
          endPoint: $point(1, 1),
          alpha: 1 - SETTING_[2] / 100
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super)
          make.centerX.equalTo(view.super).offset(10)
          make.size.equalTo($size(wid - 80, 4))
        }
      }, {
        type: "slider",
        props: {
          id: "v_slider",
          value: SETTING_[2] / 100,
          minColor: $color("clear"),
          maxColor: $color("clear")
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.prev)
          make.centerX.equalTo(view.super).offset(10)
          make.width.equalTo(wid - 80)
        },
        events: {
          changed: function(sender) {
            $("v_v").text = Math.ceil(sender.value * 100)
            cview()
            cover.v_cover(sender.value)
          }
        }
      }]
    }
  ]
}

function cview() {
  //显示主界面颜色、HEX数值、RGB数值
   color = calc.HSV2HEX($("h_v").text, $("s_v").text, $("v_v").text)
   hex_ = color[0]
   rgb_ = color[1]
   hex = "#" + hex_
   rgb = "(" + rgb_[0] + "," + rgb_[1] + "," + rgb_[2] + ")"

  $("pview").bgcolor = $color(hex)
  $("hex_v").text = hex
  $("rgb_v").text = rgb
}

function s_right() {
  //S条右侧打开默认颜色
  var f = calc.HSV2HEX(SETTING_[0], 100, 100)[0]
  f1 = "#" + f
  return f1
}

function v_right() {
  //V条右侧打开默认颜色
  var f = calc.HSV2HEX(100, SETTING_[1], 100)[0]
  f1 = "#" + f
  return f1
}

module.exports = {
  HSV: HSV
}