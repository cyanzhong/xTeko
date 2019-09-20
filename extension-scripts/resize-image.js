$app.strings = {
  "en": {
    "main-title": "Resize Image",
    "export-as": "Export as",
    "label-width": "Width",
    "label-height": "Height",
    "invalid-size": "Invalid size"
  },
  "zh-Hans": {
    "main-title": "图片缩放",
    "export-as": "导出为",
    "label-width": "宽度",
    "label-height": "高度",
    "invalid-size": "尺寸不合适"
  },
  "zh-Hant": {
    "main-title": "圖片縮放",
    "export-as": "導出為",
    "label-width": "寬度",
    "label-height": "高度",
    "invalid-size": "尺寸不合適"
  }
}

var image = $context.image

if (image) {
  $thread.main({
    delay: 0.3,
    handler: function() {
      render(image)
    }
  })
  return
}

$photo.pick({
  handler: function(resp) {
    var image = resp.image
    if (image) {
      render(image)
    }
  }
})

function render(image) {
  $ui.render({
    props: { title: $l10n("main-title") },
    views: [
      {
        type: "label",
        props: {
          id: "label-width",
          text: $l10n("label-width"),
          align: $align.center,
          textColor: $color("#666666"),
          bgcolor: $color("#EFEFEF"),
          radius: 5
        },
        layout: function(make) {
          make.left.top.equalTo(10)
          make.size.equalTo($size(64, 32))
        }
      },
      {
        type: "input",
        props: {
          id: "input-width",
          type: $kbType.number,
          text: "" + image.size.width
        },
        layout: function(make) {
          make.right.inset(10)
          make.centerY.equalTo($("label-width"))
          make.left.equalTo($("label-width").right).offset(10)
          make.height.equalTo(32)
        },
        events: {
          changed: function(sender) {
            normalize(sender, image)
          }
        }
      },
      {
        type: "label",
        props: {
          id: "label-height",
          text: $l10n("label-height"),
          align: $align.center,
          textColor: $color("#666666"),
          bgcolor: $color("#EFEFEF"),
          radius: 5
        },
        layout: function(make) {
          var view = $("label-width")
          make.left.equalTo(view)
          make.top.equalTo(view.bottom).offset(10)
          make.size.equalTo(view)
        }
      },
      {
        type: "input",
        props: {
          id: "input-height",
          type: $kbType.number,
          text: "" + image.size.height
        },
        layout: function(make) {
          make.right.inset(10)
          make.centerY.equalTo($("label-height"))
          make.left.equalTo($("label-height").right).offset(10)
          make.height.equalTo(32)
        },
        events: {
          changed: function(sender) {
            normalize(sender, image)
          }
        }
      },
      {
        type: "button",
        props: {
          title: $l10n("export-as")
        },
        layout: function(make) {
          make.left.right.inset(10)
          make.height.equalTo(32)
          make.top.equalTo($("label-height").bottom).offset(10)
        },
        events: {
          tapped: function(sender) {
            save(image)
          }
        }
      }
    ]
  })
  $("input-width").focus()
}

function normalize(sender, image) {
  var widthView = $("input-width")
  var widthValue = Number(widthView.text)
  var heightView = $("input-height")
  var heightValue = Number(heightView.text)
  if (sender === widthView) {
    heightView.text = "" + Math.round(widthValue * image.size.height / image.size.width)
  } else {
    widthView.text = "" + Math.round(heightValue * image.size.width / image.size.height)
  }
}

function save(image) {

  var width = Number($("input-width").text)
  var height = Number($("input-height").text)

  if (width == 0 || height == 0 || width > 10000 || height > 10000) {
    $ui.toast($l10n("invalid-size"))
    return
  }

  $("input-width").blur()
  $ui.menu({
    items: ["JPEG", "PNG"],
    handler: function(title, idx) {
      var resized = image.resized($size(width, height))
      var data = idx == 0 ? resized.jpg(1.0) : resized.png
      $share.sheet(data)
    }
  })
}