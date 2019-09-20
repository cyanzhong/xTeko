$app.strings = {
  "en": {
    "map-apple": "Apple",
    "map-google": "Google",
    "map-amap": "AMap",
    "map-baidu": "Baidu",
    "input-hint": "Where?"
  },
  "zh-Hans": {
    "map-apple": "苹果地图",
    "map-google": "谷歌地图",
    "map-amap": "高德地图",
    "map-baidu": "百度地图",
    "input-hint": "去哪里？"
  },
  "zh-Hant": {
    "map-apple": "蘋果地圖",
    "map-google": "谷歌地圖",
    "map-amap": "高德地圖",
    "map-baidu": "百度地圖",
    "input-hint": "去哪裡？"
  }
}

var options = [
  {
    name: $l10n("map-apple"),
    pattern: "http://maps.apple.com/?q="
  },
  {
    name: $l10n("map-google"),
    pattern: "comgooglemaps://?q="
  },
  {
    name: $l10n("map-amap"),
    pattern: "iosamap://poi?sourceApplication=pin&backScheme=pin:&name="
  },
  {
    name: $l10n("map-baidu"),
    pattern: "baidumap://map/geocoder?address="
  }
]

$input.text({
  placeholder: $l10n("input-hint"),
  handler: function(text) {
    $ui.menu({
      items: options.map(function(item) { return item.name }),
      handler: function(title, idx) {
        $app.openURL(options[idx].pattern + encodeURIComponent(text))
      }
    })
  }
})