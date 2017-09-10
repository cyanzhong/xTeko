$app.open()

var options = [
  {
    name: "图片",
    type: $assetMedia.type.image,
    subType: $assetMedia.subType.none
  },
  {
    name: "截图",
    type: $assetMedia.type.image,
    subType: $assetMedia.subType.screenshot
  },
  {
    name: "视频",
    type: $assetMedia.type.video,
    subType: $assetMedia.subType.none
  }
]


$ui.menu({
  items: options.map(function(item) { return item.name }),
  handler: function(title, idx) {
    var option = options[idx]
    var type = option.type
    var subType = option.subType
    var suffix = type == $assetMedia.type.video ? "个" : "张"
    $ui.menu({
      items: [1, 2, 3, 4, 5].map(function(item) { return "删除 " + item + " " + suffix }),
      handler: function(title, idx) {
        var count = idx + 1
        $photo.delete({
          type: type,
          subType: subType,
          count: count
        })
      }
    })
  }
})