const storage = require("./storage");
const helper = require("./helper");
const preview = require("./preview");

exports.open = callback => {
  const data = [];
  for (let padding=2; padding<=32; ++padding) {
    data.push(padding);
  }

  const selectedIndex = data.indexOf(storage.linePadding());

  $ui.push({
    props: {
      title: $l10n("LINE_PADDING")
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
            const padding = data[indexPath.row];
            preview.open({"padding": padding}, `${padding}`, () => {
              storage.setLinePadding(padding);
              callback();
            });
          }
        }
      }
    ]
  });
}