var data = {
  titles: [
    " Pay",
    "支付宝付款码",
    "支付宝扫码",
    "微信扫一扫",
  ],
  urls: [
    "shoebox://",
    "alipayqr://platformapi/startapp?saId=20000056",
    "alipayqr://platformapi/startapp?saId=10000007",
    "weixin://scanqrcode"
  ]
}

$ui.menu({
  items: data.titles,
  handler: function(title, idx) {
    $app.openURL(data.urls[idx])
  }
})
