const storage = require("./storage");
const helper = require("./helper");
const preview = require("./preview");

exports.open = callback => {
  const data = [".SF UI Text", "Lato", "Menlo", "Courier", "Source Code Pro", "Monaco", "Iosevka", "Ubuntu Mono", "Hack", "JetBrains Mono", "Cascadia Code"];
  const selectedIndex = data.indexOf(storage.font());

  $ui.push({
    props: {
      title: $l10n("FONT")
    },
    views: [
      {
        type: "list",
        props: {
          data: data
        },
        layout: $layout.fill,
        events: {
          forEachItem: (item, indexPath) => {
            helper.selectItem(item, indexPath, selectedIndex);
          },
          didSelect: (sender, indexPath) => {
            const font = data[indexPath.row];
            preview.open({"font": font}, font, () => {
              storage.setFont(font);
              callback();
            });
          }
        }
      }
    ]
  });
}