Date.prototype.format = function(fmt) {

  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }

  return fmt
}

$ui.render({
  props: {
    title: "V2EX 最热"
  },
  views: [{
    type: "list",
    props: {
      rowHeight: 64.0,
      separatorInset: $insets(0, 5, 0, 0),
      template: [{
          type: "image",
          props: {
            id: "image",
            radius: 5
          },
          layout: function(make, view) {
            make.left.top.bottom.inset(5)
            make.width.equalTo(view.height)
          }
        },
        {
          type: "label",
          props: {
            id: "title",
            font: $font("bold", 15),
            lines: 1
          },
          layout: function(make) {
            make.left.equalTo($("image").right).offset(10)
            make.top.equalTo(10)
            make.right.inset(10)
            make.height.equalTo(20)
          }
        },
        {
          type: "label",
          props: {
            id: "node",
            font: $font(12),
            lines: 1,
            bgcolor: $color("#F5F5F5"),
            textColor: $color("#777777"),
            radius: 2
          },
          layout: function(make) {
            make.left.equalTo($("title"))
            make.top.equalTo($("title").bottom).offset(5)
            make.bottom.equalTo(-10)
          }
        },
        {
          type: "label",
          props: {
            id: "author",
            font: $font("bold", 12),
            lines: 1,
            textColor: $color("#777777"),
          },
          layout: function(make) {
            make.left.equalTo($("node").right)
            make.top.equalTo($("title").bottom).offset(5)
            make.bottom.equalTo(-10)
          }
        },
        {
          type: "label",
          props: {
            id: "timestamp",
            font: $font("bold", 12),
            lines: 1,
            textColor: $color("#777777"),
          },
          layout: function(make) {
            make.left.equalTo($("author").right)
            make.right.equalTo($("title"))
            make.top.equalTo($("title").bottom).offset(5)
            make.bottom.equalTo(-10)
            make.right.inset(10)
          }
        }
      ]
    },
    layout: $layout.fill,
    events: {
      didSelect: function(tableView, indexPath) {
        openURL(tableView.object(indexPath).url)
      },
      pulled: function(sender) {
        refetch()
      }
    }
  }]
})

function refetch() {
  $http.get({
    url: "https://www.v2ex.com/api/topics/hot.json",
    handler: function(resp) {
      render(resp.data)
      $cache.set("list", resp.data)
    }
  })
}

function render(stories) {
  var data = []
  for (var idx in stories) {
    var story = stories[idx]
    data.push({
      url: "https://www.v2ex.com/t/" + story.id,
      image: {
        src: "https:" + story.member.avatar_large
      },
      title: {
        text: story.title + ''
      },
      node: {
        text: " " + story.node.title + " "
      },
      author: {
        text: "  •  " + story.member.username + "  •  "
      },
      timestamp: {
        text: new Date(story.created * 1000).format("yyyy-MM-dd hh:mm")
      }
    })
  }
  $("list").data = data
  $("list").endRefreshing()
}

function openURL(url) {
  if ($app.env == $env.today) {
    $app.openURL(url)
    return
  }
  $ui.push({
    props: {
      title: url
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

var cache = $cache.get("list")

if (cache) {
  render(cache)
}

refetch()
