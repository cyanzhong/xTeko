var list = {
  views: [
    {
      type: "image",
      props: {
        id: "app-icon-image",
        radius: 12
      },
      layout: function(make, view) {
        make.left.top.bottom.inset(10)
        make.width.equalTo(view.height)
      }
    },
    {
      type: "label",
      props: {
        id: "app-name-label",
        font: $font("bold", 20)
      },
      layout: function(make, view) {
        make.top.equalTo(10)
        make.left.equalTo($("app-icon-image").right).offset(10)
        make.right.inset(10)
      }
    },
    {
      type: "label",
      props: {
        id: "bundle-id-label",
        textColor: $color("gray"),
        font: $font(20)
      },
      layout: function(make, view) {
        make.left.equalTo($("app-name-label"))
        make.bottom.inset(10)
      }
    }
  ]
}

module.exports = {
  list: list
}