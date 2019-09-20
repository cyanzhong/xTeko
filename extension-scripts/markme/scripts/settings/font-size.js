const storage = require("./storage");
const helper = require("./helper");
const preview = require("./preview");

exports.open = callback => {
  const data = [];
  for (let size=8; size<=32; ++size) {
    data.push(size);
  }

  const selectedIndex = data.indexOf(storage.fontSize());

  $ui.push({
    props: {
      title: $l10n("FONT_SIZE")
    },
    views: [
      {
        type: "list",
        props: {
          data: data.map(item => `${item}`)
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
            const size = data[indexPath.row];
            preview.open({"size": size}, `${size}`, () => {
              storage.setFontSize(size);
              callback();
            });
          }
        }
      }
    ]
  });
}