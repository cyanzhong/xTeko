const colors = require("./colors");

exports.explorerList = (() => {
  return {
    props: {
      bgcolor: colors.darkGray
    },
    views: [
      {
        type: "image",
        props: {
          id: "icon"
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
          textColor: colors.textColor
        },
        layout: (make, view) => {
          make.left.equalTo(50);
          make.centerY.equalTo(view.super);
        }
      }
    ]
  };
})();