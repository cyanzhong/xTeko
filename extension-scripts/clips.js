$app.theme = "auto";

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
      layout({top, height}) {
        top.left.right.inset(10);
        height.equalTo(32);
      },
      events: {
        returned(sender) {
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
            handler(sender, indexPath) {
              deleteItem(indexPath);
            }
          }
        ]
      },
      layout({left, top}) {
        left.bottom.right.equalTo(0);
        top.equalTo($("input").bottom).offset(10);
      },
      events: {
        didSelect(sender, indexPath, title) {
          $clipboard.text = title;
          $device.taptic();
          $ui.toast("Copied");
        }
      }
    }
  ]
});

const listView = $("list");
const clips = $cache.get("clips") || [];
listView.data = clips;

function insertItem(text) {
  clips.unshift(text);
  listView.insert({
    index: 0,
    value: text
  });
  saveItems();
}

function deleteItem({row}) {
  const text = clips[row];
  const index = clips.indexOf(text);
  if (index >= 0) {
    clips.splice(index, 1);
    saveItems();
  }
}

function saveItems() {
  $cache.set("clips", clips);
}