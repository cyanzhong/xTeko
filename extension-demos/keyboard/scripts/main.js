var data = require("scripts/data")
var helper = require("scripts/helper")
var categories = data.getCategories()

function render() {
  $ui.render({
    views: [
      {
        type: "button",
        props: {
          id: "btn-create-category",
          title: $l10n("CREATE_CATEGORY")
        },
        layout: function(make, view) {
          make.left.bottom.right.inset(10)
          make.height.equalTo(44)
        },
        events: { tapped: create }
      },
      {
        type: "list",
        props: {
          id: "list-categories",
          data: categories,
          reorder: true,
          actions: [
            {
              title: "delete",
              handler: function(sender, indexPath) {
                helper.array_remove(categories, indexPath.row)
                data.setCategories(categories)
              }
            }
          ]
        },
        layout: function(make, view) {
          make.left.top.right.equalTo(0)
          make.bottom.equalTo($("btn-create-category").top).offset(-10)
        },
        events: {
          didSelect: function(sender, indexPath) {
            var category = categories[indexPath.row]
            require("scripts/item").showItems(category)
          },
          reorderMoved: function(fromIndexPath, toIndexPath) {
            helper.array_move(categories, fromIndexPath.row, toIndexPath.row)
          },
          reorderFinished: function() {
            data.setCategories(categories)
          }
        }
      }
    ]
  })
}

function create() {
  $input.text({
    handler: function(text) {
      if (text.length > 0) {
        categories.unshift(text)
        $("list-categories").insert({ value: text, index: 0 })
        data.setCategories(categories)
      }
    }
  })
}

module.exports = {
  render: render
}