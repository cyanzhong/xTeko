const storage = require("./storage");
const helper = require("./helper");
const preview = require("./preview");
const util = require("../common/util");

exports.open = callback => {
  const bundle = $objc("NSBundle").$mainBundle();
  const path = bundle.$bundlePath().$stringByAppendingPathComponent("Styles");
  const manager = $objc("NSFileManager").$defaultManager();
  const files = manager.$contentsOfDirectoryAtPath_error(path, null);
  const themes = [];

  for (let idx=0; idx<files.$count(); ++idx) {
    const theme = files.$objectAtIndex(idx).rawValue();
    themes.push(util.removePathExtension(theme));
  }

  const data = themes.sort();
  const selectedIndex = data.indexOf(storage.theme());

  $ui.push({
    props: {
      title: $l10n("THEME")
    },
    views: [
      {
        type: "list",
        props: {
          data: data.map(theme => {
            return theme.replace("_", "-");
          })
        },
        layout: $layout.fill,
        events: {
          ready: sender => {
            helper.scrollToIndex(sender, selectedIndex);
          },
          forEachItem: (item, indexPath) => {
            helper.selectItem(item, indexPath, selectedIndex);
          },
          didSelect: (sender, indexPath) => {
            const theme = data[indexPath.row];
            const title = theme.replace("_", "-");
            preview.open({"theme": theme}, title, () => {
              storage.setTheme(theme);
              callback();
            });
          }
        }
      }
    ]
  });
}