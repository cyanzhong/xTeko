const colors = require("../common/colors");
const storage = require("../settings/storage");

module.exports = (() => {
  return {
    views: [
      {
        type: "label",
        props: {
          id: "title",
          textColor: colors.text
        },
        layout: (make, view) => {
          make.left.right.inset(15);
          make.centerY.equalTo(view.super);
        }
      },
      {
        type: "label",
        props: {
          id: "subtitle",
          textColor: colors.gray,
          align: $align.right
        },
        layout: (make, view) => {
          make.right.inset(5);
          make.centerY.equalTo(view.super);
        }
      },
      {
        type: "switch",
        props: {
          id: "switcher"
        },
        layout: (make, view) => {
          make.right.inset(15);
          make.centerY.equalTo(view.super);
        },
        events: {
          changed: sender => {
            const key = sender.info.key;
            if (key === "auto-save") {
              storage.setAutoSave(sender.on);
            }
          }
        }
      }
    ]
  }
})();