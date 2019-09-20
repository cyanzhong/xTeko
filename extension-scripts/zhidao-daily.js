$app.open()
$ui.loading(true)
$http.get({
  url: "https://zhidao.baidu.com/daily",
  handler: function(resp) {
    $ui.loading(false)
    var html = JSON.stringify(resp.data).replace(/\n|\s|\r/g, "")
    var titles = html.match(/alt=\\\".*?\\\"/g)
    var images = html.match(/<imgsrc=\\\".*?jpg/g)
    var arr = html.match(/\/daily\/view.*?id=\d+/g)
    var readt = html.match(/阅读\(\d+\)/g)
    var bannertitle = JSON.stringify(html.match(/banner-title.*?span/)).replace("[\"banner-title\\\\\\\">", "").replace("<\/span\"\]", "")
    var bannerauthor = JSON.stringify(html.match(/banner-author.*?span/)).replace("[\"banner-author\\\\\\\">来自：", "").replace("<\/span\"\]", "")
    var bannerimg = JSON.stringify(html.match(/banner-bg-img.*?png/)).match(/http.*?png/)
    var newarr = (function(arr) {
      var m = {}, newarr = []
      for (var i = 0; i < arr.length; i++) {
        var v = arr[i];
        if (!m[v]) {
          newarr.push(v);
          m[v] = true;
        }
      }
      return newarr;
    })(arr);
    dailylist(titles, images, newarr, readt, bannertitle, bannerauthor, bannerimg[0])
  }
})

function dailylist(titles, images, urls, readt, bannertitle, bannerauthor, bannerimg) {
  $ui.render({
    props: {
      title: "知道日报"
    },
    views: [{
      type: "list",
      props: {
        rowHeight: 70.0,
        separatorInset: $insets(0, 5, 0, 0),
        template: [{
            type: "image",
            props: {
              id: "image"
            },
            layout: function(make, view) {
              make.left.top.bottom.inset(5)
              make.width.equalTo(100)
            }
          },
          {
            type: "label",
            props: {
              id: "label",
              font: $font("bold", 17),
              lines: 0
            },
            layout: function(make) {
              make.left.equalTo($("image").right).offset(10)
              make.top.equalTo(15)
              make.right.inset(10)
              make.height.equalTo(20)
            }
          },
          {
            type: "label",
            props: {
              id: "time",
              font: $font(12),
              lines: 1,
              bgcolor: $color("#F5F5F5"),
              textColor: $color("#777777"),
              radius: 2
            },
            layout: function(make) {
              make.left.equalTo($("label"))
              make.top.equalTo($("label").bottom).offset(5)
              make.bottom.equalTo(-15)
            }
          },
        ],
        actions: [{
          title: "在Safari打开",
          handler: function(tableView, indexPath) {
            $app.openURL(tableView.object(indexPath).url)
          }
        }]
      },
      layout: $layout.fill,
      events: {
        didSelect: function(tableView, indexPath) {
          openURL(tableView.object(indexPath).url, tableView.object(indexPath).title)
        }
      }
    }]
  })

  var data = []

  data.push({
    label: {
      text: bannertitle
    },
    image: {
      src: bannerimg
    },
    time: {
      text: bannerauthor
    },
    url: "https://zhidao.baidu.com" + urls[0] + "&fr=daily-index-banner",
    title: bannertitle
  })

  for (var i = 0; i < titles.length; i++) {
    var id = i + 1
    var tjson = JSON.stringify(titles[i])
    var title = tjson.replace(/\"/g, "").replace(/\\/g, "").replace("alt=", "")
    var reg = /知道日报作者/
    var match = reg.test(title)
    if (match === true) {

    } else {
      var ijson = JSON.stringify(images[i])
      var image = ijson.replace(/\"/g, "").replace(/\\/g, "").replace("<imgsrc=", "")
      data.push({
        label: {
          text: title
        },
        image: {
          src: image
        },
        time: {
          text: readt[i]
        },
        url: "https://zhidao.baidu.com" + urls[id],
        title: title
      })
    }
  }

  $("list").data = data
  $("list").endRefreshing()
}

function openURL(url, title) {
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