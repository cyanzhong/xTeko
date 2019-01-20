const utility = require("./utility");
const colors = require("./colors");
var editingPlugin = null;
var completionHandler = null;

exports.show = (plugin, completion) => {

  editingPlugin = plugin;
  completionHandler = completion;

  let isEditing = plugin != null;

  if (editingPlugin == null) {
    editingPlugin = {"name": $l10n("NEW_PLUGIN"), "icon": "055"};
  }

  let cells = [
    {
      rows: [
        {
          type: "view",
          views: [
            {
              type: "label",
              props: {
                text: $l10n("PLUGIN_NAME")
              },
              layout: (make, view) => {
                make.left.equalTo(15);
                make.centerY.equalTo(view.super);
              }
            },
            {
              type: "label",
              props: {
                id: "name-label",
                align: $align.center,
                text: editingPlugin.name
              },
              layout: (make, view) => {
                make.right.inset(15);
                make.centerY.equalTo(view.super);
              }
            }
          ],
          layout: $layout.fill
        },
        {
          type: "view",
          views: [
            {
              type: "label",
              props: {
                text: $l10n("PLUGIN_ICON")
              },
              layout: (make, view) => {
                make.left.equalTo(15);
                make.centerY.equalTo(view.super);
              }
            },
            {
              type: "image",
              props: {
                id: "icon-image",
                bgcolor: colors.clear,
                icon: $icon(editingPlugin.icon)
              },
              layout: (make, view) => {
                make.right.inset(15);
                make.centerY.equalTo(view.super);
                make.size.equalTo($size(20, 20));
              }
            }
          ],
          layout: $layout.fill
        }
      ]
    }
  ];
  
  let header = {
    props: {
      height: 16
    }
  }
  
  let footer = {
    props: {
      height: 360
    },
    views: [
      {
        type: "button",
        props: {
          title: $l10n("DONE"),
          bgcolor: $color("#263238"),
          radius: 0
        },
        layout: (make, view) => {
          make.left.bottom.right.equalTo(0);
          make.height.equalTo(44);
        },
        events: {
          tapped: done
        }
      },
      {
        type: "web",
        props: {
          showsProgress: false,
          bgcolor: $color("#263238"),
          opaque: false,
          html: $file.read("assets/code-editor.html").string
        },
        layout: (make, view) => {
          make.left.top.right.inset(0);
          make.bottom.equalTo($("button").top).offset(-16);
        },
        events: {
          didFinish: sender => {
            if (editingPlugin) {
              let content = utility.loadPlugin(editingPlugin);
              if (content) {
                let encoded = $text.base64Encode(content);
                sender.eval({"script": `setText("${encoded}")`});
              }
            }
          }
        }
      }
    ]
  }

  $ui.push({
    props: {
      title: $l10n(isEditing ? "EDIT_PLUGIN" : "NEW_PLUGIN"),
      navButtons: [  
        {
          icon: "054",
          handler: () => $safari.open({"url": $l10n("DOCS_LINK")})
        },
      ]
    },
    views: [
      {
        type: "list",
        props: {
          scrollEnabled: false,
          data: cells,
          header: header,
          footer: footer
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            let view = sender.cell(indexPath);
            utility.showTapAnimation(view);
            if (indexPath.row === 0) {
              inputName();
            } else {
              selectIcon();
            }
          }
        }
      }
    ]
  });
};

async function inputName() {
  let name = await $input.text({"text": editingPlugin.name});
  if (name.length === 0) {
    $ui.error($l10n("INVALID_NAME"));
  } else {
    editingPlugin.name = name;
    $("name-label").text = name;
  }
}

async function selectIcon() {
  let icon = await $ui.selectIcon();
  editingPlugin.icon = icon;
  $("icon-image").icon = $icon(icon);
}

async function done() {

  if (editingPlugin.name.length === 0) {
    $ui.error($l10n("INVALID_NAME"));
    return;
  }

  $device.taptic(1);

  let text = (await $("web").eval("getText()"))[0];

  // Changed, use script instead of file
  if (utility.loadPlugin(editingPlugin) !== text) {
    editingPlugin.script = text;
  }

  if (completionHandler) {
    completionHandler(editingPlugin);
    $ui.pop();
  }
}