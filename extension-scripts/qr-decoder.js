$app.strings = {
  "en": {
    "title1": "Clipboard Saved",
    "title2": "Open URL",
    "title3": "Cancel",
    "title4": "Clipboard Saved",
    "title5": "OK",
    "title6": "QR Code Error",
    "title7": "OK",
    "title8": "QR Decoder",
    "title9": "Scan from QR Code",
    "title10": "Pick from Photos",
    "title11": "Cancel",
    "msg1_1": "The image you ",
    "msg1_2": " should be a QR Code.\n\nPlease try again.",
    "va1": "pick from Photos",
    "va2": "run through Action Extension"
  },
  "zh-Hans": {
    "title1": "已保存到剪切板",
    "title2": "打开 URL",
    "title3": "取消",
    "title4": "已保存到剪切板",
    "title5": "好的",
    "title6": "二维码有误",
    "title7": "好的",
    "title8": "二维码解码",
    "title9": "扫描二维码",
    "title10": "从相册选取二维码",
    "title11": "取消",
    "msg1_1": "您的图片",
    "msg1_2": "不是二维码。\n\n请再次尝试。",
    "va1": "(来自相册获取)",
    "va2": "(来自 Action Extension)"
  }
}


function showResult(text, runningExt) {
  var url = text.match(/\w+:\/\/[^\s]+/i)
  $clipboard.text = text
  if (url) {
    $ui.alert({
      title: $l10n("title1"),
      message: text,
      actions: [{
        title: $l10n("title2"),
        handler: function() {
          $app.openURL(url)
          if (runningExt)
            $context.close()
        }
      },
      {
        title: $l10n("title3"),
        style: "Cancel",
        handler: function() {
          if (runningExt)
            $context.close()
        }
      }]
    })
  } else {
    $ui.alert({
      title: $l10n("title4"),
      message: text,
      actions: [{
        title: $l10n("title5"),
        style: "Cancel",
        handler: function() {
          if (runningExt)
            $context.close()
        }
      }]
    })
  }
}

function showWarning(text, runningExt) {
  $ui.alert({
    title: $l10n("title6"),
    message: $l10n("msg1_1") + text + $l10n("msg1_2"),
    actions: [{
      title: $l10n("title7"),
      style: "Cancel",
      handler: function() {
        if (runningExt)
          $context.close()
      }
    }]
  })
}

/* Main */

var qr = $context.image
if (qr == null) {
  $ui.alert({
    title: $l10n("title8"),
    actions: [{
        title: $l10n("title10"),
        handler: function() {
          $photo.pick({
            handler: function(resp) {
              var text = $qrcode.decode(resp.image)
              if (text) {
                showResult(text, false)
              } else {
                showWarning($l10n("va1"), false)
              }
            }
          })
        }
      },
      {
        title: $l10n("title11"),
        style: "Cancel"
      }
    ]
  })
} else {
  var text = $qrcode.decode(qr)
  if (text) {
    showResult(text, true)
  } else {
    showWarning($l10n("va2"), true)
  }
}
