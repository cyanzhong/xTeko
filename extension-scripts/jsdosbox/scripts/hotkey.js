exports.edit = (index, key, callback) => {
  $ui.push({
    props: {
      title: `${$l10n("HOT_KEY_INDEX")} ${index + 1}`,
      navButtons: [
        {
          icon: "008",
          handler: () => {
            $app.openURL("https://keycode.info/");
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "value-list",
          stickyHeader: false,
          template: {
            views: [
              {
                type: "label",
                props: {
                  id: "label"
                },
                layout: (make, view) => {
                  make.left.inset(15);
                  make.centerY.equalTo(view.super);
                }
              },
              {
                type: "switch",
                props: {
                  id: "switch"
                },
                layout: (make, view) => {
                  make.right.inset(15);
                  make.centerY.equalTo(view.super);
                },
                events: {
                  changed: sender => {
                    key[sender.info.key] = sender.on;
                    saveChanges();
                  }
                }
              }
            ]
          }
        },
        layout: $layout.fill,
        events: {
          didSelect: async(sender, indexPath) => {
            if (indexPath.section >= 2) {
              return;
            }
            
            let type = indexPath.section == 0 ? $kbType.ascii : $kbType.number;
            let text = await $input.text({type: type});

            if (text) {
              if (indexPath.section == 0) {
                key.name = text;
              } else {
                key.code = parseInt(text);
              }
              saveChanges();
            }
          }
        }
      }
    ]
  });

  function reloadData(data) {
    $("value-list").data = [
      {
        title: $l10n("NAME"),
        rows: [
          {
            "label": {
              "text": data.name
            },
            "switch": {
              "hidden": true
            }
          }
        ]
      },
      {
        title: $l10n("KEY_CODE"),
        rows: [
          {
            "label": {
              "text": `${data.code}`
            },
            "switch": {
              "hidden": true
            }
          }
        ]
      },
      {
        title: $l10n("MODIFIERS"),
        rows: [
          {
            "label": {
              "text": "Shift"
            },
            "switch": {
              on: key.shift || false,
              info: {
                key: "shift"
              }
            }
          },
          {
            "label": {
              "text": "Ctrl"
            },
            "switch": {
              on: key.ctrl || false,
              info: {
                key: "ctrl"
              }
            }
          },
          {
            "label": {
              "text": "Alt"
            },
            "switch": {
              on: key.alt || false,
              info: {
                key: "alt"
              }
            }
          },
          {
            "label": {
              "text": "Meta"
            },
            "switch": {
              on: key.meta || false,
              info: {
                key: "meta"
              }
            }
          }
        ]
      }
    ]
  }

  function saveChanges() {
    reloadData(key);
    callback(key);
  }

  reloadData(key);
}