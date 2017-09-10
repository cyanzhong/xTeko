$app.keyboardToolbarEnabled = true

$ui.render({
  props: {
    title: "Color"
  },
  views: [
    {
      type: "input",
      props: {
        id: "input-red",
        placeholder: "Red",
        align: $align.center,
        type: $kbType.number
      },
      layout: function(make, view) {
        make.left.top.equalTo(10)
        make.height.equalTo(32)
        make.width.equalTo(view.super).multipliedBy(0.33).offset(-36.5)
      },
      events: {
        changed: function(sender) {
          rgbToHex()
        }
      }
    },
    {
      type: "input",
      props: {
        id: "input-green",
        placeholder: "Green",
        align: $align.center,
        type: $kbType.number
      },
      layout: function(make) {
        make.top.equalTo(10)
        make.left.equalTo($("input-red").right).offset(10)
        make.size.equalTo($("input-red"))
      },
      events: {
        changed: function(sender) {
          rgbToHex()
        }
      }
    },
    {
      type: "input",
      props: {
        id: "input-blue",
        placeholder: "Blue",
        align: $align.center,
        type: $kbType.number
      },
      layout: function(make) {
        make.top.equalTo(10)
        make.left.equalTo($("input-green").right).offset(10)
        make.size.equalTo($("input-green"))
      },
      events: {
        changed: function(sender) {
          rgbToHex()
        }
      }
    },
    {
      type: "button",
      props: {
        id: "button-hex",
        title: "Copy"
      },
      layout: function(make) {
        make.left.equalTo($("input-blue").right).offset(10)
        make.centerY.height.equalTo($("input-blue"))
        make.right.inset(10)
      },
      events: {
        tapped: function(sender) {
          showRgbCopyMenu()
        }
      }
    },
    {
      type: "input",
      props: {
        id: "input-hex",
        placeholder: "Hex",
        align: $align.center,
        type: $kbType.ascii
      },
      layout: function(make) {
        make.left.inset(10)
        make.right.inset(84)
        make.top.equalTo($("input-red").bottom).offset(10)
        make.height.equalTo(32)
      },
      events: {
        changed: function(sender) {
          hexToRgb()
        }
      }
    },
    {
      type: "button",
      props: {
        id: "button-hex",
        title: "Copy"
      },
      layout: function(make) {
        make.left.equalTo($("input-hex").right).offset(10)
        make.centerY.height.equalTo($("input-hex"))
        make.right.inset(10)
      },
      events: {
        tapped: function(sender) {
          showHexCopyMenu()
        }
      }
    }
  ]
})

$("input-red").focus()

function rgbToHex() {
  function convert(id) {
    return new Number($(id).text).toString(16).toUpperCase()
  }
  $("input-hex").text = convert("input-red") + convert("input-green") + convert("input-blue")
}

function showRgbCopyMenu() {
  var red = $("input-red").text
  var green = $("input-green").text
  var blue = $("input-blue").text
  $ui.menu({
    items: ["rgb(" + red + ", " + green + ", " + blue + ")", red + ", " + green + ", " + blue],
    handler: function(title) {
      $clipboard.text = title
    }
  })
}

function hexToRgb() {
  var hex = parseInt($("input-hex").text, 16)
  $("input-red").text = "" + (hex & 0xff0000) >> 16
  $("input-green").text = "" + (hex & 0xff00) >> 8
  $("input-blue").text = "" + (hex & 0xff)
}

function showHexCopyMenu() {
  var value = $("input-hex").text
  $ui.menu({
    items: ["#" + value, "0x" + value],
    handler: function(title) {
      $clipboard.text = title
    }
  })
}