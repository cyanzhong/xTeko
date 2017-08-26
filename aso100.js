var regex = /.+id(\d+).*/
var match = regex.exec($context.link || $clipboard.links[0])
var appid = match[1]

var options = [
  {
    title: "基本信息",
    path: "baseinfo"
  },
  {
    title: "实时排名",
    path: "rank"
  },
  {
    title: "评论详情",
    path: "commentList"
  },
  {
    title: "版本信息",
    path: "version"
  }
]

$ui.menu({
  items: options.map(function(item) { return item.title }),
  handler: function(title, idx) {
    $safari.open({url: "https://aso100.com/app/" + options[idx].path + "/appid/" + appid})
  }
})