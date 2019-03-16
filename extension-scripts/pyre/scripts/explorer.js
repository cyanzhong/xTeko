const colors = require("./colors");
const fonts = require("./fonts");
const modules = $file.list("modules").filter(file => {
  return file.toLowerCase().endsWith(".py");
});

exports.open = handlers => {
  $ui.push({
    props: {
      title: $l10n("MODULES")
    },
    views: [
      {
        type: "list",
        props: {
          bgcolor: colors.darkGray,
          separatorColor: colors.lightGray,
          template: {
            props: {
              bgcolor: colors.darkGray
            },
            views: [
              {
                type: "label",
                props: {
                  id: "label",
                  textColor: colors.textColor
                },
                layout: (make, view) => {
                  make.left.equalTo(15);
                  make.centerY.equalTo(view.super);
                }
              }
            ]
          },
          data: modules.map(item => {
            return {
              "label": {
                "text": item
              }
            }
          })
        },
        layout: $layout.fill,
        events: {
          didSelect: async(sender, indexPath) => {
            const name = modules[indexPath.row];
            const options = [$l10n("IMPORT"), $l10n("EXECUTE")];
            const {index} = await $ui.menu(options);
            if (index == 0) {
              importModule(name, handlers);
            } else if (index == 1) {
              executeModule(name, handlers);
            }
          }
        }
      }
    ]
  });
}

function importModule(name, handlers) {
  handlers.import(name);
  $ui.pop();
}

function executeModule(name, handlers) {
  handlers.execute(name);
  $ui.pop();
}