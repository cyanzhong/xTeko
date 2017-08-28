$ui.render({
  props: {
    title: "Clips"
  },
  views: [
    {
      type: "button",
      props: {
        title: "选择"
      },
      layout: function(make) {
        make.right.top.inset(10)
        make.size.equalTo($size(64, 32))
      },
      events: {
        tapped: function(sender) {
          selectItem()
        }
      }
    },
    {
      type: "input",
      props: {
        placeholder: "输入要收藏的内容"
      },
      layout: function(make) {
        make.top.left.inset(10)
        make.right.equalTo($("button").left).offset(-10)
        make.height.equalTo($("button"))
      },
      events: {
        returned: function(sender) {
          insertItem(sender.text)
          sender.blur()
          sender.text = ""
        }
      }
    },
    {
      type: "list",
      props: {
        id: "list",
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
        make.top.equalTo($("input").bottom).offset(10)
      },
      events: {
        didSelect: function(sender, indexPath, title) {
          $clipboard.text = title
          $device.taptic()
          $ui.toast("已复制")
        }
      }
    }
  ]
})

var listView = $("list")
var clips = $cache.get("clips") || []
listView.data = clips

function insertItem(text) {
  clips.unshift(text)
  listView.insert({
    index: 0,
    value: text
  })
  saveItems()
}

function deleteItem(indexPath) {
  var text = clips[indexPath.row]
  var index = clips.indexOf(text)
  if (index >= 0) {
    clips.splice(index, 1)
    saveItems()
  }
}

function selectItem() {
  $ui.push({
    props: {
      title: "历史记录"
    },
    views: [
      {
        type: "list",
        props: {
          data: $clipboard.list(50)
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
  $cache.set("clips", clips)
}