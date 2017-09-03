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
            make.height.equalTo(20);
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
            $http.get({
              url: tableView.object(indexPath).url,
              handler: function(resp) {
                var data = resp.data;
                // For rtmp flv, please check the API response
                // flv can be streamed by vlc , and not expire
                // Here simply redirect to hls_url, which could expire
                if(data.data && data.data.hls_url){
                    openURL( data.data.hls_url );
                }else{
                    $ui.alert('没有 HLS 链接');
                }
              }
            })
          }
        },
        {
          title: "nPlayer",
          handler: function(tableView, indexPath) {
            $http.get({
              url: tableView.object(indexPath).url,
              handler: function(resp) {
                var data = resp.data;
                //handle flv with nPlayer Plus
                if(data.data && data.data.rtmp_url && data.data.rtmp_live){
                    var flv = 'nplayer-' + data.data.rtmp_url + '/' + data.data.rtmp_live
                    $app.openURL(flv)
                }else{
                    $ui.alert('没有 FLV 链接');
                }
              }
            })
          }
        }
      ]
    },
    layout: $layout.fill,
    events: {
      didSelect: function(tableView, indexPath) {
        $http.get({
          url: tableView.object(indexPath).url,
          handler: function(resp) {
            var data = resp.data;
            // For rtmp flv, please check the API response
            // flv can be streamed by vlc , and not expire
            // Here simply redirect to hls_url, which could expire
            if(data.data && data.data.hls_url){
                openURL( data.data.hls_url );
            }else{
                $ui.alert('没有 HLS 链接');
            }
          }
        })
      },
      pulled: function(sender) {
        refetch()
      }
    }
  }]
})

function refetch() {
  $http.get({
    url: "https://api.maxjia.com/api/live/list/",     // Use at your own risk
    handler: function(resp) {
      render(resp.data.result)
    }
  })
}

function render(stories) {
  var data = []
  for (var idx in stories) {
    var story = stories[idx]

    data.push({
        url:  story.url_info? story.url_info.url + '' : '',
        image: {
          src: story.live_img + ''
        },
        title: {
          text: story.live_title  + ''
        },
        node:{
          text: " " + (story.live_name?story.live_name:'') + " "
        },
        author:{
          text: "  •  " + (story.live_nickname?story.live_nickname:'') + "  •  "
        },
        timestamp:{
          text:  story.live_online + '正在观看'
        }
      })

  }
  $("list").data = data
  $("list").endRefreshing()
}

function openURL(url) {
  if ($app.env == $env.today) {
    $app.openURL(url)
    return;
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
refetch()
