$ui.render({
  props: {
    title: "Clips"
  },
  views: [
    {
      type: "input",
      props: {
        placeholder: "Type text here..."
      },
      layout: function(make) {
        make.top.left.right.inset(10);
        make.height.equalTo(32);
      },
      events: {
        returned: function(sender) {
          insertItem(sender.text);
          sender.blur();
          sender.text = "";
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
              deleteItem(indexPath);
            }
          }
        ]
      },
      layout: function(make) {
        make.left.bottom.right.equalTo(0);
        make.top.equalTo($("input").bottom).offset(10);
      },
      events: {
        didSelect: function(sender, indexPath, title) {
          $clipboard.text = title;
          $device.taptic();
          $ui.toast("Copied");
        }
      }
    }
  ]
});

var listView = $("list");
var clips = $cache.get("clips") || [];
listView.data = clips;

function insertItem(text) {
  clips.unshift(text);
  listView.insert({
    index: 0,
    value: text
  });
  saveItems();
}

function deleteItem(indexPath) {
  var text = clips[indexPath.row];
  var index = clips.indexOf(text);
  if (index >= 0) {
    clips.splice(index, 1);
    saveItems();
  }
}

function saveItems() {
  $cache.set("clips", clips);
}
