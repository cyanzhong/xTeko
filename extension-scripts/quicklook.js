var data = $context.data
if (data) {
  $quicklook.open({data: data})
  return
}

var image = $context.image
if (image) {
  $quicklook.open({image: image})
  return
}

var text = $context.text
if (text) {
  $quicklook.open({text: text})
  return
}

var link = $context.link
if (link) {
  $quicklook.open({url: link})
  return
}