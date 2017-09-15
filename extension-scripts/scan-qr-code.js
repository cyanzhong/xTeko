$app.strings = {
  "en": {
    "title": "QR Code",
    "btn-clipboard-title": "Copy to clipboard",
    "btn-open-title": "Open",
  },
  "zh-Hans": {
    "title": "二维码",
    "btn-clipboard-title": "复制到剪贴板",
    "btn-open-title": "打开",
  },
  "zh-Hant": {
    "title": "二維碼",
    "btn-clipboard-title": "複製到剪貼板",
    "btn-open-title": "打開",
  }
}

var resultView = function(result) {
  return {
    views: [
      {
        type: "label",
        props: {
          id: "result-label",
          text: result,
          align: $align.center,
          font: $font(20),
          textColor: $color("#000000"),
          selectable: false,
          lines: 0
        },
        layout: function(make, view) {
          make.top.equalTo(view.super).offset(30)
          make.left.right.equalTo(view.super).inset(15)
        }
      },
      {
        type: "button",
        props: {
          id: "btn-open",
          title: $l10n("btn-open-title"),
          bgcolor: $color("#34495E"),
          radius: 8,
          tintColor: $color("#ffffff")
        },
        layout: function(make, view) {
          make.left.right.equalTo(view.super).inset(15)
          make.bottom.equalTo(view.super).inset(30)
          make.height.equalTo(50)
        },
        events: {
          tapped: function(sender) {
            $app.openURL(result)
          }
        }
      },
      {
        type: "button",
        props: {
          id: "btn-clipboard",
          title: $l10n("btn-clipboard-title"),
          bgcolor: $color("#E74C3C"),
          radius: 8,
          tintColor: $color("#ffffff")
        },
        layout: function(make, view) {
          make.left.right.equalTo(view.super).inset(15)
          make.top.equalTo($("btn-open").top).offset(-70)
          make.height.equalTo(50)
        },
        events: {
          tapped: function(sender) {
            $clipboard.text = result
          }
        }
      }
    ]
  }
}

$qrcode.scan(function(text) {
  $ui.render(resultView(text))  
})
