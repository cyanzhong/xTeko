let regions = [
  { name: "🇨🇳 中国", code: "cn" },
  { name: "🇭🇰 香港", code: "hk" },
  { name: "🇺🇸 美国", code: "us" },
  { name: "🇬🇧 英国", code: "gb" },
  { name: "🇯🇵 日本", code: "jp" },
]

let version = parseInt($device.info.version.split(".")[0]);
let prefix = version >= 13 ? "itms-apps://apps.apple.com/" : "https://itunes.apple.com/";

$ui.menu({
  items: regions.map(function(item) {
    return item.name;
  }),
  handler: function(title, idx) {
    $app.openURL(prefix + regions[idx].code + "/app/");
  }
});