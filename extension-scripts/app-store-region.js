var regions = [
  { name: "🇨🇳 中国", code: "cn" },
  { name: "🇭🇰 香港", code: "hk" },
  { name: "🇨🇳 台湾", code: "tw" },
  { name: "🇺🇸 美国", code: "us" },
  { name: "🇬🇧 英国", code: "uk" },
  { name: "🇯🇵 日本", code: "jp" }
]

$ui.menu({
  items: regions.map(function(item) { return item.name }),
  handler: function(title, idx) {
    $app.openURL("https://itunes.apple.com/" + regions[idx].code + "/app/dummy-app/id0123456789")
  }
})