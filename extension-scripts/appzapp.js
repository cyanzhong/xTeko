var regex = /.+id(\d+).*/
var match = regex.exec($context.link || $clipboard.link)
var appid = match[1]
$app.openURL("appzapp://app?appid=" + appid)