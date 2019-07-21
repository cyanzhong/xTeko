exports.explorerList = [
  {
    type: "label",
    props: {
      id: "title"
    },
    layout: (make, view) => {
      make.centerY.equalTo(view.super);
      make.left.right.inset(15);
    }
  },
  {
    type: "label",
    props: {
      id: "subtitle",
      align: $align.right
    },
    layout: (make, view) => {
      make.centerY.equalTo(view.super);
      make.right.inset(15);
    }
  }
];