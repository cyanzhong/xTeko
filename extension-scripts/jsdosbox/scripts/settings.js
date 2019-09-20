const fn = require("./fn");
const utility = require("./utility");

exports.getCommand = path => {
  return $cache.get(`command-${path}`) || "";
}

exports.setCommand = (path, command) => {
  $cache.set(`command-${path}`, command);
}

exports.getFolder = path => {
  return $cache.get(`folder-${path}`) || (() => {
    if (utility.isValidFolder(path)) {
      return path;
    } else {
      return $text.MD5(path).substr(0, 8).toUpperCase();
    }
  })();
}

exports.setFolder = (path, folder) => {
  $cache.set(`folder-${path}`, folder);
}

exports.open = () => {
  $ui.push({
    props: {
      title: $l10n("SETTINGS")
    },
    views: [
      {
        type: "list",
        props: {
          id: "key-list",
          stickyHeader: false,
          template: {
            views: [
              {
                type: "label",
                props: {
                  id: "name-label",
                  font: $font(17)
                },
                layout: (make, view) => {
                  make.centerY.equalTo(view.super);
                  make.left.inset(15);
                }
              },
              {
                type: "label",
                props: {
                  id: "code-label",
                  font: $font(17)
                },
                layout: (make, view) => {
                  make.centerY.equalTo(view.super);
                  make.right.inset(15);
                }
              }
            ]
          }
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            const hotKey = require("./hotkey");
            let index = indexPath.row;
            let keys = fn.keys();
            let key = keys[index];
            hotKey.edit(index, key, edited => {
              keys[index] = key;
              let string = JSON.stringify(keys);
              let file = $data({"string": string});
              $file.write({
                data: file,
                path: "assets/fn.json"
              });
              reloadData();
            });
          }
        }
      }
    ]
  });

  reloadData();
}

function reloadData() {
  $("key-list").data = [
    {
      title: $l10n("HOT_KEYS"),
      rows: fn.keys().map(item => {
        return {
          "name-label": {"text": item.name},
          "code-label": {"text": `${item.code}`}
        }
      })
    }
  ];
}