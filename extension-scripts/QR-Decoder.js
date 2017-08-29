function showResult(text, runningExt) {
  var url = text.match(/\w+:\/\/[^\s]+/i)
  $clipboard.text = text
  if (url) {
    $ui.alert({
      title: "Clipboard Saved",
      message: text,
      actions: [{
        title: "Open URL",
        handler: function() {
          $app.openURL(url)
          if (runningExt)
            $context.close()
        }
      },
      {
        title: "Cancel",
        style: "Cancel",
        handler: function() {
          if (runningExt)
            $context.close()
        }
      }]
    })
  } else {
    $ui.alert({
      title: "Clipboard Saved",
      message: text,
      actions: [{
        title: "OK",
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
    title: "QR Code Error",
    message: "The image you " + text + " should be a QR Code.\n\nPlease try again.",
    actions: [{
      title: "OK",
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
    title: "QR Decoder",
    actions: [{
        title: "Scan from QR Code",
        handler: function() {
          $qrcode.scan(function(text) {
            showResult(text, false)
          })
        }
      },
      {
        title: "Pick from Photos",
        handler: function() {
          $photo.pick({
            handler: function(resp) {
              var text = $qrcode.decode(resp.image)
              if (text) {
                showResult(text, false)
              } else {
                showWarning("pick from Photos", false)
              }
            }
          })
        }
      },
      {
        title: "Cancel",
        style: "Cancel"
      }
    ]
  })
} else {
  var text = $qrcode.decode(qr)
  if (text) {
    showResult(text, true)
  } else {
    showWarning("run through Share Extension", true)
  }
}