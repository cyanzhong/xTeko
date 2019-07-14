const colors = require("../define/colors");
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
      },
      {
        type: "view",
        props: {
          id: "theme",
          radius: 16,
          borderColor: colors.text,
          borderWidth: 2
        },
        layout: (make, view) => {
          make.right.inset(15);
          make.size.equalTo($size(32, 32));
          make.centerY.equalTo(view.super);
        }
      },
      {
        type: "tab",
        props: {
          id: "quality"
        },
        layout: (make, view) => {
          make.right.inset(15);
          make.centerY.equalTo(view.super);
        },
        events: {
          changed: sender => {
            const index = sender.index;
            storage.setImageQuality(index);
            $device.taptic(1);
          }
        }
      }
    ]
  }
})();