var extensions = $cache.get("extensions") || []

if ($app.env != $env.app) {
  $ui.menu({
    items: extensions,
    handler: function(title, idx) {
      $app.openExtension(title)
    }
  })
  return
}

$ui.render({
  props: {
    title: "xTeko 收藏夹"
  },
  views: [
    {
      type: "button",
      props: {
        title: "添加扩展"
      },
      layout: function(make) {
        make.left.right.top.inset(10)
        make.height.equalTo(32)
      },
      events: {
        tapped: function(sender) {
          selectItem()
        }
      }
    },
    {
      type: "list",
      props: {
        id: "list",
        reorder: true,
        actions: [
          {
            title: "delete",
            handler: function(sender, indexPath) {
              deleteItem(indexPath)
            }
          }
        ]
      },
      layout: function(make) {
        make.left.bottom.right.equalTo(0)
        make.top.equalTo($("button").bottom).offset(10)
      },
      events: {
        didSelect: function(sender, indexPath, title) {
          $app.openExtension(title)
        },
        reorderMoved: function(from, to) {
          extensions.move(from.row, to.row)
        },
        reorderFinished: function() {
          saveItems()
        }
      }
    }
  ]
})

var listView = $("list")
listView.data = extensions

function insertItem(text) {
  extensions.unshift(text)
  listView.insert({
    index: 0,
    value: text
  })
  saveItems()
}

function deleteItem(indexPath) {
  var text = extensions[indexPath.row]
  var index = extensions.indexOf(text)
  if (index >= 0) {
    extensions.splice(index, 1)
    saveItems()
  }
}

function selectItem() {
  $ui.push({
    props: {
      title: "所有扩展"
    },
    views: [
      {
        type: "list",
        props: {
          data: $file.extensions
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath, title) {
            insertItem(title)
            $ui.pop()
          }
        }
      }
    ]
  })
}

function saveItems() {
  $cache.set("extensions", extensions)
}

Array.prototype.move = function(from, to) {
  var object = this[from]
  this.splice(from, 1)
  this.splice(to, 0, object)
}