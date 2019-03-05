var keys = $cache.get("keys") || loadMapper("8BitDo.json");

const editingKeys = ["L", "R", "U", "D", "B", "A", "$L", "$R", "SELECT", "START"];
var data = null;
var editIndex = -1;
var mapper = swapKeys();

$app.listen({
  keyUp: code => {
    if (isEditing()) {
      keys[editingKeys[editIndex]] = code;
      editIndex = -1;
      reloadData();
      saveKeys();
    }
  }
});

exports.mapper = mapper;

exports.open = () => {
  $ui.push({
    props: {
      title: $l10n("KEYBOARD_SETTINGS"),
      navButtons: [
        {
          title: $l10n("PRESET"),
          handler: showMappers
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "key-list",
          template: [
            {
              type: "label",
              props: {
                id: "title"
              },
              layout: (make, view) => {
                make.left.inset(20);
                make.centerY.equalTo(view.super);
              }
            },
            {
              type: "label",
              props: {
                id: "subtitle"
              },
              layout: (make, view) => {
                make.right.inset(20);
                make.centerY.equalTo(view.super);
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            editIndex = indexPath.row;
            reloadData();
          }
        }
      }
    ],
    events: {
      disappeared: () => {
        editIndex = -1;
      }
    }
  });

  reloadData();
}

function reloadData() {
  data = [];
  ["←", "→", "↑", "↓", "B", "A", "L", "R", "SELECT", "START"]
  .forEach((title, idx) => {
    data.push({
      title: title,
      subtitle: `${keys[editingKeys[idx]]}`,
    });
  });

  if (isEditing()) {
    data[editIndex].subtitle = $l10n("PLEASE_PRESS");
  }

  $("key-list").data = data.map(item => {
    return {
      "title": {
        "text": item.title
      },
      "subtitle": {
        "text": item.subtitle
      }
    }
  });
}

function isEditing() {
  return editIndex >= 0;
}

function saveKeys() {
  $cache.set("keys", keys);
  mapper = swapKeys();
}

function swapKeys() {
  var ret = {};
  for(var key in keys) {
    ret[keys[key]] = key;
  }
  return ret;
}

function loadMapper(name) {
  let json = $file.read(`assets/mappers/${name}`).string;
  return JSON.parse(json);
}

async function showMappers() {
  let files = $file.list("assets/mappers");
  let {index} = await $ui.menu(files.map(file => {
    return file.replace(".json", "");
  }));

  keys = loadMapper(files[index]);
  saveKeys();

  editIndex = -1;
  reloadData();

  $device.taptic(2);
}