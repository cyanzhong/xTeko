const constants = require("../define/constants");
const colors = require("../define/colors");
const names = constants.fontNames;
const sizes = constants.fontSizes;

exports.selectFont = (name, size, handler) => {
  let selectedName = name;
  let selectedSize = size;

  $ui.push({
    props: {
      title: $l10n("FONTS")
    },
    views: [
      {
        type: "tab",
        props: {
          id: "size-tab",
          index: sizes.indexOf(size),
          items: sizes.map(size => {
            return $l10n(size.toUpperCase());
          })
        },
        layout: (make, view) => {
          make.left.equalTo(view.super.safeAreaLeft).offset(10);
          make.right.equalTo(view.super.safeAreaRight).offset(-10);
          make.top.equalTo(10);
        },
        events: {
          changed: sender => {
            selectedSize = sizes[sender.index];
            handler(selectedName, selectedSize);
          }
        }
      },
      {
        type: "list",
        props: {
          id: "font-list",
          template: [
            {
              type: "label",
              props: {
                id: "name-label"
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.bottom.equalTo(0);
              }
            }
          ]
        },
        layout: (make, view) => {
          make.top.equalTo($("size-tab").bottom).offset(10);
          make.left.bottom.right.equalTo(0);
        },
        events: {
          didSelect: (sender, indexPath) => {
            selectedName = names[indexPath.row];
            handler(selectedName, selectedSize);
            reloadData(selectedName);
          }
        }
      }
    ]
  });

  reloadData(selectedName);
}

function reloadData(selectedName) {
  $("font-list").data = names.map(name => {
    return {
      "name-label": {
        text: name,
        textColor: selectedName === name ? colors.blue : colors.text,
        font: $font(name, 17)
      }
    }
  });
}