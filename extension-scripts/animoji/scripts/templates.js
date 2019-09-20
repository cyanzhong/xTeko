var matrix = {
  props: {
    bgcolor: $color("background"),
    radius: 8
  },
  views: [
    {
      type: "image",
      props: {
        id: "thumb-image",
        bgcolor: $color("clear"),
        contentMode: $contentMode.scaleAspectFit
      },
      layout: (make, view) => {
        make.center.equalTo(view.super);
        make.size.equalTo($size(48, 48));
      }
    },
    {
      type: "view",
      props: {
        id: "selected-border",
        borderColor: $color("tint"),
        borderWidth: 4,
        radius: 8,
        hidden: true
      },
      layout: $layout.fill
    }
  ]
};

module.exports = {
  matrix: matrix
}