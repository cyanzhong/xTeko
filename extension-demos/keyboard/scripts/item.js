var data = require("scripts/data")
var helper = require("scripts/helper")

function showItems(category) {

  var items = data.getItems(category)

  function createItem() {
    $input.text({
      handler: function(text) {
        if (text.length > 0) {
          items.unshift(text)
          $("list-items").insert({ value: text, index: 0 })
          saveItems()
        }
      }
    })
  }

  function saveItems() {
    data.setItems(category, items)
  }

  $ui.push({
    props: {
      title: category
    },
    views: [
      {
        type: "button",
        props: {
          id: "btn-create-snippet",
          title: $l10n("CREATE_SNIPPET")
        },
        layout: function(make, view) {
          make.left.bottom.right.inset(10)
          make.height.equalTo(44)
        },
        events: { tapped: createItem }
      },
      {
        type: "list",
        props: {
          id: "list-items",
          data: items,
          reorder: true,
          actions: [
            {
              title: "delete",
              handler: function(sender, indexPath) {
                helper.array_remove(items, indexPath.row)
                saveItems()
              }
            }
          ]
        },
        layout: function(make, view) {
          make.left.top.right.equalTo(0)
          make.bottom.equalTo($("btn-create-snippet").top).offset(-10)
        },
        events: {
          didSelect: function(sender, indexPath) {
            $clipboard.text = items[indexPath.row]
            $ui.toast($l10n("COPIED"))
          },
          reorderMoved: function(fromIndexPath, toIndexPath) {
            helper.array_move(items, fromIndexPath.row, toIndexPath.row)
          },
          reorderFinished: function() {
            saveItems()
          }
        }
      }
    ]
  })
}

module.exports = {
  showItems: showItems
}