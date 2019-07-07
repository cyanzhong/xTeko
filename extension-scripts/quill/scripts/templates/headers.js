const constants = require("../define/constants");
const colors = require("../define/colors");

exports.cloudFolder = tapped => {
  return {
    type: "view",
    views: [
      {
        type: "view",
        props: {
          bgcolor: colors.separator
        },
        layout: (make, view) => {
          make.left.bottom.right.equalTo(0);
          make.height.equalTo(constants.onePixel);
        }
      },
      {
        type: "button",
        props: {
          height: 44,
          bgcolor: $color("clear"),
          radius: 0
        },
        layout: (make, view) => {
          make.top.bottom.equalTo(0);
          make.left.equalTo(view.super.safeAreaLeft);
          make.right.equalTo(view.super.safeAreaRight);
        },
        views: [
          {
            type: "image",
            props: {
              src: "assets/drive.png",
              contentMode: $contentMode.scaleAspectFit
            },
            layout: (make, view) => {
              make.left.equalTo(15);
              make.size.equalTo($size(20, 20));
              make.centerY.equalTo(view.super);
            }
          },
          {
            type: "label",
            props: {
              id: "label",
              textColor: colors.text,
              text: $l10n("ICLOUD_DRIVE")
            },
            layout: (make, view) => {
              make.left.equalTo(50);
              make.centerY.equalTo(view.super);
            }
          }
        ],
        events: {
          tapped: tapped
        }
      }
    ]
  };
}

exports.dummy = () => {
  return {
    props: {
      height: 0.01
    }
  }
}