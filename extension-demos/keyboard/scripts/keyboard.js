var data = require("scripts/data")
var categories = data.getCategories()

function render() {
  $ui.render({
    views: [
      {
        type: "tab",
        props: {
          items: categories
        },
        layout: function(make, view) {
          make.left.top.right.inset(10)
        },
        events: {
          changed: function(sender) {
            $("list").data = data.getItems(categories[sender.index])
          }
        },
      },
      {
        type: "list",
        props: {
          data: data.getItems(categories[0]),
          rowHeight: 38.0
        },
        layout: function(make, view) {
          make.top.equalTo($("tab").bottom).offset(10)
          make.left.bottom.right.equalTo(0)
        },
        events: {
          didSelect: function(sender, indexPath, title) {
            $keyboard.insert(title)
            $keyboard.playInputClick()
          }
        }
      },
      {
        type: "view",
        props: {
          bgcolor: $color("#dddddd")
        },
        layout: function(make) {
          make.left.right.equalTo(0)
          make.top.equalTo($("list"))
          make.height.equalTo(1.0 / $device.info.screen.scale)
        }
      }
    ]
  })
}

module.exports = {
  render: render
}