var completionHandler = null;
let plugins = JSON.parse($file.read("assets/plugins.json").string);

exports.show = (completion) => {

  completionHandler = completion;

  $ui.push({
    props: {
      title: $l10n("BUILTIN_PLUGINS")
    },
    views: [
      {
        type: "list",
        props: {
          template: {
            views: [
              {
                type: "image",
                props: {
                  id: "icon-image"
                },
                layout: (make, view) => {
                  make.left.equalTo(15);
                  make.centerY.equalTo(view.super);
                  make.size.equalTo($size(20, 20));
                }
              },
              {
                type: "label",
                props: {
                  id: "name-label",
                  font: $font("medium", 17)
                },
                layout: (make, view) => {
                  make.left.equalTo($("icon-image").right).offset(12);
                  make.centerY.equalTo(view.super);
                }
              }
            ]
          },
          data: plugins.map(item => {
            return {
              "title": $l10n(item.title),
              "rows": item.rows.map(row => {
                return {
                  "icon-image": {
                    "icon": $icon(row.icon)
                  },
                  "name-label": {
                    "text": $l10n(row.name)
                  }
                }
              })
            }
          })
        },
        layout: $layout.fill,
        events: {
          didSelect: didSelect
        }
      }
    ]
  });
}

function didSelect(sender, indexPath) {
  $device.taptic(0);

  let plugin = plugins[indexPath.section].rows[indexPath.row];
  plugin.name = $l10n(plugin.name);
  
  if (completionHandler) {
    completionHandler(plugin);
    $ui.pop();
  }
}