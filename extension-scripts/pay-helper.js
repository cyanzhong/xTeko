var data = {
  title: [
    "Apple Pay",
    "支付宝付款码",
    "支付宝扫码",
    "微信扫一扫",
  ],
  url: [
    "shoebox://",
    "alipayqr://platformapi/startapp?saId=20000056",
    "alipayqr://platformapi/startapp?saId=10000007",
    "weixin://scanqrcode"
  ]
}

$ui.render({
  props: {
    title: "支付方式"
  },
  views: [{
    type: "list",
    props: {
      data: data.title
    },
    layout: $layout.fill,
    events: {
      didSelect: function(tableView, indexPath, title) {
        $app.openURL(data.url[indexPath.row])
      }
    }
  }]
})