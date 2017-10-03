//free apps installing
$ui.render({
  props:{
    title:"APPValley"
  },
  views: [
    {
      type: "image",
      props: {
        id: "ico",
        src: "https://i.loli.net/2017/10/03/59d303fa78fa2.jpeg",
        radius: 10
      },
      layout: function(make, view) {
        make.top.inset(20)
        make.size.equalTo(110,110)
        make.centerX.equalTo(view.super)
      }
    },
    {
      type: "button",
      props: {
        id:"b1",
        title: "App Store"
      },
      layout: function(make, view) {
        make.right.left.inset(10)
        make.top.equalTo($("ico").bottom).offset(20)
        make.wdi
      },
      events: {
        tapped: function(sender) {
          APPList("https://api.tweakboxapp.com/enjoy/appstore.json", "App Store")
        }
      }
    },
    {
      type: "button",
      props: {
        id:"b2",
        title: "Games"
      },
      layout: function(make, view) {
        make.right.left.inset(10)
        make.top.equalTo($("b1").bottom).offset(10)
      },
      events: {
        tapped: function(sender) {
          APPList("https://api.tweakboxapp.com/enjoy/games.json", "Games")
        }
      }
    },
    {
      type: "button",
      props: {
        id:"b3",
        title: "Tweakbox"
      },
      layout: function(make, view) {
        make.right.left.inset(10)
        make.top.equalTo($("b2").bottom).offset(10)
      },
      events: {
        tapped: function(sender) {
          APPList("https://api.tweakboxapp.com/enjoy/tweakbox.json", "Tweakbox")
        }
      }
    },
    {
      type: "button",
      props: {
        id:"b4",
        title: "Tweaked"
      },
      layout: function(make, view) {
        make.right.left.inset(10)
        make.top.equalTo($("b3").bottom).offset(10)
      },
      events: {
        tapped: function(sender) {
          APPList("https://api.tweakboxapp.com/enjoy/tweaked.json", "Tweaked")
        }
      }
    },
    {
      type: "button",
      props: {
        id:"b7",
        title: "[Others]"
      },
      layout: function(make, view) {
        make.right.left.inset(10)
        make.top.equalTo($("b4").bottom).offset(10)
      },
      events: {
        tapped: function(sender) {
          Others()
        }
      }
    },
  ]
})

function Others() {
  $ui.push({
  props:{
    title:"Others"
  },
  views:[
    {
      type: "button",
      props: {
        id:"b5",
        title: "AppValley for Web",
        bgcolor: $color("#3B3B3B")
      },
      layout: function(make, view) {
        make.right.left.top.inset(10)
      },
      events: {
        tapped: function(sender) {
          OpenUrl("https://appvalley.vip/app/#view-2", "Web")
        }
      }
    },
    {
      type: "button",
      props: {
        id:"b6",
        title: "Install AppValley",
        bgcolor: $color("#3B3B3B")
      },
      layout: function(make, view) {
        make.right.left.inset(10)
        make.top.equalTo($("b5").bottom).offset(10)
      },
      events: {
        tapped: function(sender) {
          $app.openURL("https://appvalley.vip/webclip.mobileconfig")
        }
      }
    }
  ]
})
}

function APPList(api,title){
  refetch(api)
$ui.push({
  props: {
    title: title
  },
  views: [
  {
    type: "list",
    props: {
      rowHeight: 64.0,
      separatorInset: $insets(0, 5, 0, 0),
      template: [{
          type: "image",
          props: {
            id: "img",
            radius: 7
          },
          layout: function(make, view) {
            make.left.top.bottom.inset(5)
            make.width.equalTo(view.height)
          }
        },
        {
          type: "label",
          props: {
            id: "label",
            font: $font("bold", 16),
            lines: 1
          },
          layout: function(make, view) {
            make.left.equalTo($("img").right).offset(10)
            make.top.equalTo(10)
            make.right.inset(10)
            make.height.equalTo(20)
          }
        },
        {
          type: "label",
          props: {
            id: "label1",
            font: $font(12),
            lines: 1,
            bgcolor: $color("#F5F5F5"),
            textColor: $color("#777777"),
            radius: 2
          },
          layout: function(make) {
            make.left.equalTo($("label"))
            make.top.equalTo($("label").bottom).offset(5)
            make.bottom.equalTo(-10)
          }
        },
      ],
      actions: [{
          title: "Copy link",
          handler: function(tableView, indexPath) {
            $ui.toast("copied")
            $clipboard.text = tableView.object(indexPath).ipa
          }
        },
      ]
    },
    layout: $layout.fill,
    events: {
      didSelect: function(tableView, indexPath) {
        $ui.menu({
          items: ["Install"],
          handler: function(title, idx) {
            if (title === "Install") {
              $app.openURL(tableView.object(indexPath).url)
            }
          }
        })
      },
      pulled: function(sender) {
        refetch(api)
      }
    }
  }]
})
}

function refetch(api) {
  $ui.loading(true)
  $http.get({
    url: api,
    handler: function(resp) {
      $ui.loading(false)
      render(resp.data.data)
      $cache.set("stories", resp.data.data)
    }
  })
}

function render(stories) {
  var data = []
  for (var idx in stories) {
    var story = stories[idx]
    data.push({
      url: story.TBAppLink,
      ipa: story.TBAppUrl,
      img: {
        src: story.TBAppIcon
      },
      label: {
        text: story.TBAppName
      },
      label1: {
        text: story.TBAppSize
      }
    })
  }
  $("list").data = data
  $("list").endRefreshing()
}

function OpenUrl(url, title) {
  $ui.push({
    props: {
      title: title
    },
    views: [{
      type: "web",
      props: {
        url: url
      },
      layout: $layout.fill
    }]
  })
}

var cache = $cache.get("stories")

if (cache) {
  render(cache)
}

refetch()
