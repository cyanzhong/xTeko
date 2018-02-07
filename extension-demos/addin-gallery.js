//-- Data --//
var lang = $device.info.language
var categories = $cache.get("categories") || []
var category = 20000 // Default
var addins = []

//-- Strings --//
$app.strings = {
  "en": {
    "MAIN_TITLE": "Gallery",
    "SHARE": "Share",
    "GET": "Get",
    "SHOW_DETAILS": "Show Details",
    "INSTALLED": "Installed",
    "FAILED": "Failed",
    "AUTHOR": "Author",
    "WEBSITE": "Website",
    "VERSION": "Version"
  },
  "zh-Hans": {
    "MAIN_TITLE": "扩展列表",
    "SHARE": "分享",
    "GET": "获取",
    "SHOW_DETAILS": "查看详情",
    "INSTALLED": "安装成功",
    "FAILED": "获取失败",
    "AUTHOR": "作者",
    "WEBSITE": "网站",
    "VERSION": "版本"
  }
}

//-- UI --//
$ui.render({
  props: {title: $l10n("MAIN_TITLE")},
  views: [{
    type: "menu",
    props: {items: categories.map(function(item) { return item.name })},
    layout: function(make) {
      make.left.top.right.equalTo(0)
      make.height.equalTo(44)
    },
    events: {
      changed: function(sender) {
        queryAddins(categories[sender.index].id)
      }
    }
  }, {
    type: "list",
    props: {
      rowHeight: 150,
      template: [{
        type: "image",
        props: {
          id: "icon-view",
          bgcolor: $color("clear")
        },
        layout: function(make) {
          make.size.equalTo($size(20, 20))
          make.left.top.equalTo(16)
        }
      }, {
        type: "label",
        props: {
          id: "name-label",
          font: $font("medium", 20)
        },
        layout: function(make) {
          var view = $("icon-view")
          make.left.equalTo(view.right).offset(10)
          make.centerY.equalTo(view)
        }
      }, {
        type: "label",
        props: {
          id: "summary-label",
          lines: 0,
          textColor: $color("#666666"),
          font: $font(15)
        },
        layout: function(make) {
          var view = $("icon-view")
          make.left.equalTo(view)
          make.right.inset(16)
          make.top.equalTo(view.bottom).offset(16)
        }
      }]
    },
    layout: function(make) {
      make.left.bottom.right.equalTo(0)
      make.top.equalTo($("menu").bottom)
    },
    events: {
      didSelect: function(sender, indexPath) {
        $ui.menu({
          items: [$l10n("GET"), $l10n("SHARE"), $l10n("SHOW_DETAILS")],
          handler: function(title, idx) {
            var addin = addins[indexPath.row]
            if (idx == 0) {
              installAddin(addin)
            } else if (idx == 1) {
              shareAddin(addin)
            } else if (idx == 2) {
              showDetails(addin)
            }
          }
        })
      },
      pulled: function() {
        queryAddins(category)
      }
    }
  }]
})

//-- Query addins --//
function queryAddins(id) {
  category = id

  // Cache
  var cacheKey = "addins-" + id
  var cache = $cache.get(cacheKey) || []
  if (cache.length > 0) {
    render(cache)
  }

  // Render
  function render(data) {
    $("list").data = data.map(function(item) {
      return {
        "icon-view": {
          icon: $icon(item.icon, $color("#b7bec6"))
        },
        "name-label": {
          text: item.name
        },
        "summary-label": {
          text: item.summary
        }
      }
    })
  }

  $http.get({
    url: "https://xteko.com/store/query?id=" + id + "&lang=" + lang,
    handler: function(resp) {
      addins = resp.data.result || []
      render(addins)
      $cache.set(cacheKey, addins)
      $("list").endRefreshing()
    }
  })
}

//-- Query categories --//
function queryCategories() {
  $http.get({
    url: "https://xteko.com/store/categories?lang=" + lang,
    handler: function(resp) {
      categories = resp.data.result
      $("menu").items = categories.map(function(item) { return item.name })
      $cache.set("categories", categories)
    }
  })
}

//-- Install addin --//
function installAddin(addin) {
  $ui.loading(true)
  $http.download({
    url: addin.url,
    handler: function(resp) {
      $ui.loading(false)
      var data = resp.data
      if (data) {
        $addin.save({name: addin.name, icon: addin.icon, data: data})
      }
      $ui.toast(data ? $l10n("INSTALLED") : $l10n("FAILED"))
    }
  })
}

//-- Share addin --//
function shareAddin(addin) {
  $share.sheet("https://xteko.com/store/install?id=" + addin.id + "&lang=" + lang)
}

//-- Show aetails --//
function showDetails(addin) {
  $ui.push({
    props: {title: addin.name},
    views: [{
      type: "list",
      props: {
        template: [{
          type: "label",
          props: {id: "key-label"},
          layout: function(make, view) {
            make.centerY.equalTo(view.super)
            make.left.inset(12)
          }
        }, {
          type: "label",
          props: {
            id: "value-label",
            textColor: $color("#666666")
          },
          layout: function(make, view) {
            make.centerY.equalTo(view.super)
            make.right.inset(12)
          }
        }],
        data: [{
          "key-label": {
            text: $l10n("AUTHOR")
          },
          "value-label": {
            text: addin.author || "JSBox"
          }
        }, {
          "key-label": {
            text: $l10n("WEBSITE")
          },
          "value-label": {
            text: addin.website || "https://docs.xteko.com"
          }
        }, {
          "key-label": {
            text: $l10n("VERSION")
          },
          "value-label": {
            text: addin.version || "1.0.0"
          }
        }]
      },
      layout: $layout.fill,
      events: {
        didSelect: function(sender, indexPath, data) {
          if (data["key-label"].text === $l10n("WEBSITE")) {
            $app.openURL(data["value-label"].text)
          }
        }
      }
    }]
  })
}

//-- Start --//
queryAddins(category)
queryCategories()