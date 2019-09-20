var link = $context.link || $clipboard.link

if (!link) {
  return
}

var id = /.+id=(\d+).*/.exec(link)[1]

if (id.length > 0) {
  $app.openURL("pin://install?id=" + id)
} else if (link.lastIndexOf("pin://install?url=", 0) === 0) {
  $app.openURL(link)
} else {
  $app.openURL("pin://install?url=" + encodeURIComponent(link))
}