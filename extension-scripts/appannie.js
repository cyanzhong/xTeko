var regex = /.+id(\d+).*/
var match = regex.exec($context.link || $clipboard.link)
var appid = match[1]
$safari.open({url: "https://www.appannie.com/apps/ios/app/" + appid + "/details/"})