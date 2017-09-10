function deal_with_story(story, play) {
  if (story.live_name == 'douyu') {
    if (!story.url_info.url) {
      $ui.alert('API返回错误')
      return
    }
    $http.get({
      url: story.url_info.url,
      handler: function(resp) {
        var data = resp.data
        if (play == 'HLS') {
          // For rtmp flv, please check the API response
          // flv can be streamed by vlc , and not expire
          // Here simply redirect to hls_url, which could expire
          if (data.data && data.data.hls_url) {
            openURL(data.data.hls_url)
          } else {
            $ui.alert('没有 HLS 链接')
          }
        } else if (play == 'nPlayer') {
          //handle flv with nPlayer Plus
          if (data.data && data.data.rtmp_url && data.data.rtmp_live) {
            var flv = 'nplayer-' + data.data.rtmp_url + '/' + data.data.rtmp_live
            $app.openURL(flv)
          } else {
            $ui.alert('没有 FLV 链接')
          }
        }
      }
    })
  } else if (story.live_id && story.live_name) {
    $http.get({
      url: "https://api.maxjia.com/api/live/detail/?live_type=" + story.live_name + "&live_id=" + story.live_id,
      handler: function(resp) {
        var data = resp.data
        if (data.status == 'ok') {
          var stream_list = resp.data.result.stream_list
          if (stream_list) {
            var url = stream_list[0].url
            if (play == 'HLS') {
              // For rtmp flv, please check the API response
              // flv can be streamed by vlc , and not expire
              // Here simply redirect to hls_url, which could expire
              if (url) {
                openURL(url)
              } else {
                $ui.alert('没有 HLS 链接')
              }
            } else if (play == 'nPlayer') {
              //handle flv with nPlayer Plus
              if (url) {
                var flv = 'nplayer-' + url
                $app.openURL(flv)
              } else {
                $ui.alert('没有 FLV 链接')
              }
            }
          }
        } else {
          if (data.msg) {
            $ui.alert(data.msg)
          } else {
            $ui.alert('不在线')
          }
        }
      }
    })
  }
}

$ui.render({
  props: {
    title: "DotA Max+"
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
            make.width.equalTo(80)
            make.height.equalTo(45)
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
      ],
      actions: [{
          title: "HLS",
          handler: function(tableView, indexPath) {
            deal_with_story(tableView.object(indexPath).story, 'HLS')
          }
        },
        {
          title: "nPlayer",
          handler: function(tableView, indexPath) {
            deal_with_story(tableView.object(indexPath).story, 'nPlayer')
          }
        }
      ]
    },
    layout: $layout.fill,
    events: {
      didSelect: function(tableView, indexPath) {
        //斗鱼 HLS 有过期时间，此处用 Safari 直接打开测试显示效果，其它使用 nPlayer
        if (tableView.object(indexPath).story.live_name == 'douyu') {
          deal_with_story(tableView.object(indexPath).story, 'HLS')
        } else {
          deal_with_story(tableView.object(indexPath).story, 'nPlayer')
        }
      },
      pulled: function(sender) {
        refetch()
      }
    }
  }]
})

function refetch() {
  $http.get({
    url: "https://api.maxjia.com/api/live/list/", // Use at your own risk
    handler: function(resp) {
      render(resp.data.result)
      $cache.set("list", resp.data.result)
    }
  })
}

function render(stories) {
  var data = []
  for (var idx in stories) {
    var story = stories[idx]

    data.push({
      image: {
        src: story.live_img + ''
      },
      title: {
        text: story.live_title + ''
      },
      node: {
        text: " " + story.live_name + " "
      },
      author: {
        text: "  •  " + story.live_nickname + "  •  "
      },
      timestamp: {
        text: story.live_online + '名观众'
      },
      story: story
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
