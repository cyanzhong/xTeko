$app.strings = {
  "en": {
    "setting_title": "Set Browsers",
    "browser_chrome": "Chrome",
    "browser_uc": "UC",
    "browser_qq": "QQ",
    "browser_opera": "Opera",
    "browser_quark": "Quark",
    "browser_icab": "iCab",
    "browser_dolphin": "Dolphin",
    "browser_safari": "Safari"
  },
  "zh-Hans": {
    "setting_title": "设置浏览器",
    "browser_chrome": "Chrome",
    "browser_uc": "UC",
    "browser_qq": "QQ",
    "browser_opera": "欧朋",
    "browser_quark": "夸克",
    "browser_icab": "iCab",
    "browser_dolphin": "海豚",
    "browser_safari": "Safari"
  },
  "zh-Hant": {
    "setting_title": "設置瀏覽器",
    "browser_chrome": "Chrome",
    "browser_uc": "UC",
    "browser_qq": "QQ",
    "browser_opera": "歐朋",
    "browser_quark": "夸克",
    "browser_icab": "iCab",
    "browser_dolphin": "海豚",
    "browser_safari": "Safari"
  }
}

var link = $context.link || $clipboard.link
var encoded = encodeURIComponent(link)
var hiddenIndexes = $cache.get("hidden-indexes") || []

var browsers = [
  {
    name: $l10n("browser_chrome"),
    handler: function() { $app.openURL("googlechrome-x-callback://x-callback-url/open/?url=" + encoded) }
  },
  {
    name: $l10n("browser_uc"),
    handler: function() { $app.openURL("ucbrowser://" + link) }
  },
  {
    name: $l10n("browser_qq"),
    handler: function() { $app.openURL("mqqbrowser://url=" + link) }
  },
  {
    name: $l10n("browser_opera"),
    handler: function() { $app.openURL("oupeng-callback://open?url=" + encoded) }
  },
  {
    name: $l10n("browser_quark"),
    handler: function() { $app.openURL("quark://" + link) }
  },
  {
    name: $l10n("browser_icab"),
    handler: function() { $app.openURL("x-icabmobile://x-callback-url/open?url=" + link + "&destination=newTab") }
  },
  {
    name: $l10n("browser_dolphin"),
    handler: function() { $app.openURL("dolphin://" + link) }
  },
  {
    name: $l10n("browser_safari"),
    handler: function() { $app.openURL(link) }
  }
]

if ($app.env != $env.app) {
  $ui.menu({
    items: browsers.filter(function(item, index) {
      return hiddenIndexes.indexOf(index) === -1
    }).map(function(item) {
      return item.name
    }),
    handler: function(title) {
      for (var idx=0; idx<browsers.length; ++idx) {
        if (browsers[idx].name === title) {
          browsers[idx].handler()
          break
        }
      }
    }
  })
  return
}

$ui.render({
  props: { title: $l10n("setting_title") },
  views: [
    {
      type: "list",
      props: {
        template: [
          {
            type: "label",
            props: { id: "label" },
            layout: function(make) {
              make.left.right.inset(10)
              make.top.bottom.equalTo(0)
            }
          },
          {
            type: "switch",
            props: { id: "switch" },
            layout: function(make, view) {
              make.centerY.equalTo(view.super)
              make.right.inset(10)
            },
            events: {
              changed: function(sender) {
                var index = hiddenIndexes.indexOf(sender.info)
                if (index === -1) {
                  hiddenIndexes.push(sender.info)
                } else {
                  hiddenIndexes.splice(index, 1);
                }
                $cache.set("hidden-indexes", hiddenIndexes)
              }
            }
          }
        ],
        data: browsers.map(function(item, index) { 
          return {
            label: { text: item.name },
            switch: { on: hiddenIndexes.indexOf(index) === -1, info: index }
          }
        })
      },
      layout: $layout.fill,
      events: {
        didSelect(sender, indexPath) {
          browsers[indexPath.row].handler()
        }
      }
    }
  ]
})