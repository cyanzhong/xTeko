var image = $clipboard.image
if (image) {
  $share.universal(image)
  return
}

var link = $clipboard.link
if (link) {
  $ui.menu({
    items: ["分享链接", "分享文本"],
    handler: function(title, idx) {
      if (idx == 0) {
        $share.sheet(link)
      } else {
        $share.sheet($clipboard.text)
      }
    }
  })
  return
}

var text = $clipboard.text
if (text) {
  $share.sheet(text)
  return
}