var list = {
  views: [
    {
      type: "image",
      props: {
        id: "icon-image",
        smoothRadius: 17.0
      },
      layout: function(make, view) {
        make.left.top.bottom.inset(10)
        make.width.equalTo(view.height)
      }
    },
    {
      type: "label",
      props: {
        id: "name-label",
        font: $font("bold", 20)
      },
      layout: function(make, view) {
        make.top.equalTo(8)
        make.left.equalTo($("icon-image").right).offset(10)
        make.right.inset(10)
      }
    },
    {
      type: "label",
      props: {
        id: "desc-label",
        font: $font(14),
        lines: 0
      },
      layout: function(make, view) {
        make.left.equalTo($("icon-image").right).offset(10)
        make.right.inset(10)
        make.top.equalTo($("name-label").bottom).offset(5)
        make.bottom.inset(5)
      }
    }
  ]
}

function convert(item) {
  return {
    "icon-image": {
      src: item.artworkUrl100.replaceAll("100x100", "200x200")
    },
    "name-label": {
      text: item.trackCensoredName
    },
    "desc-label": {
      text: item.description || ""
    }
  }
}

module.exports = {
  list: list,
  convert: convert
}