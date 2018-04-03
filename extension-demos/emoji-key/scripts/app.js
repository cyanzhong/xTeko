var emoji = require("scripts/emoji")
var list = emoji.list

function init() {
  $ui.render({
    views: [
      {
        type: "input",
        props: {
          id: "text-input",
          text: $clipboard.text,
          userInteractionEnabled: $app.env == $env.app
        },
        layout: function(make, view) {
          make.left.top.right.inset(10)
          make.height.equalTo(32)
        },
        events: {
          ready: function(sender) {
            if ($app.env == $env.app) {
              sender.focus()
            }
          },
          returned: function(sender) {
            sender.blur()
          }
        }
      },
      {
        type: "matrix",
        props: {
          columns: 5,
          itemHeight: 50,
          spacing: 25,
          template: {
            views: [
              {
                type: "label",
                props: {
                  id: "label",
                  align: $align.center,
                  font: $font(36)
                },
                layout: $layout.fill
              }
            ]
          },
          data: list.map(function(item) {
            return {
              label: {
                text: item
              }
            }
          })
        },
        layout: function(make, view) {
          make.top.equalTo($("text-input").bottom)
          make.left.bottom.right.equalTo(0)
        },
        events: {
          didSelect: function(sender, indexPath) {
            $ui.menu({
              items: [$l10n("BIG_EMOJI"), $l10n("EMOJI_WITH_TEXT")],
              handler: function(title, idx) {
                createBigEmoji(list[indexPath.row], idx == 0 ? null : $("text-input").text)
              }
            })
          }
        }
      }
    ]
  })
}

function createBigEmoji(emoji, text) {

  var canvas = $ui.create({type: "view"})
  canvas.frame = $rect(0, 0, 200, text == null ? 200 : 250)

  canvas.add({
    type: "label",
    props: {
      text: emoji,
      font: $font(150),
      align: $align.center,
      frame: $rect(0, 0, 200, 200)
    }
  })

  if (text != null) {
    canvas.add({
      type: "label",
      props: {
        text: text,
        font: $font(32),
        align: $align.center,
        frame: $rect(0, 180, 200, 50)
      }
    })
  }

  var image = canvas.snapshot
  $clipboard.image = image
  $quicklook.open({image: image})
}

module.exports = {
  init: init
}