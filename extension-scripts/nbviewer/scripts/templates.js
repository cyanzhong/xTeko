const colors = require("./colors");

exports.explorerList = (() => {
  return {
    props: {
      bgcolor: colors.white
    },
    views: [
      {
        type: "image",
        props: {
          id: "icon",
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
          textColor: colors.text
        },
        layout: (make, view) => {
          make.left.equalTo(50);
          make.centerY.equalTo(view.super);
        }
      }
    ]
  };
})();