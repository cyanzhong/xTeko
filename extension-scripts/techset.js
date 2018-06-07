var page = 1;

const icon_map = {
  "KANGZUBIN" : "https://tva3.sinaimg.cn/crop.0.0.440.440.180/621b53aejw8ekybg28hxzj20c80c83z0.jpg",
  "halohily" : "https://tva4.sinaimg.cn/crop.9.0.493.493.180/d9ec7ffcjw8f8a753z961j20e80dp0t3.jpg",
  "Vong_HUST" : "https://tvax3.sinaimg.cn/crop.0.0.667.667.180/ba81ca29ly8fhu4meonedj20ij0ijgmh.jpg",
  "Lefe_x" : "https://tva4.sinaimg.cn/crop.8.0.1226.1226.180/006uSOiEjw8f9h4ihstq4j30yi0y2gnq.jpg",
  "南峰子" : "https://tva1.sinaimg.cn/crop.1.0.1366.1366.180/c5ff030ejw8f5bbc70i61j212011yq80.jpg",
  "南峰子_老驴" : "https://tva1.sinaimg.cn/crop.1.0.1366.1366.180/c5ff030ejw8f5bbc70i61j212011yq80.jpg",
  "高老师很忙" : "https://tva4.sinaimg.cn/crop.0.0.1242.1242.180/5fe18d75jw8evft9qcjh5j20yi0yigo5.jpg"
}

// about us content
const about_us_content = "知识小集是一个团队公众号，主要定位在移动开发领域，分享移动开发技术，包括 iOS、Android、小程序、移动前端、React Native、weex 等。每周都会有 **原创** 文章分享，我们的文章都会在公众号首发。欢迎关注查看更多内容。<center><img src=\"https://user-gold-cdn.xitu.io/2018/5/8/1633d1278e68b61a?w=430&h=430&f=jpeg&s=38777\" title=\"知识小集\" width=\"250\"/></center>";

// list cell layout
const list_templete = [
  {
    type: "image",
    props: {
      id: 'cover',
      radius: 8,
    },
    layout: function(make, view) {
      make.left.equalTo(8)
      make.size.equalTo($size(44, 44))
      make.top.equalTo(15)
    }
  },
  {
    type: "label",
    props: {
      id: "title",
      lines: 2,
      font: $font(16)
    },
    layout: function(make) {
      make.left.equalTo($("cover").right).offset(8)
      make.top.equalTo(8)
      make.right.equalTo(-8);
      make.height.equalTo(24)
    }
  },
  {
    type: "label",
    props: {
      id: "author",
      textColor: $color("#888888"),
      font: $font(12)
    },
    layout: function(make) {
      make.left.equalTo($("title"))
      make.top.equalTo($("title").bottom)
      make.bottom.equalTo(0)
    }
  },
  {
    type: "label",
    props: {
      id: 'postdate',
      textColor: $color("#888888"),
      font: $font(12)
    },
    layout: function(make) {
      make.left.equalTo($("author").right).offset(8)
      make.top.equalTo($("title").bottom)
      make.bottom.equalTo(0)
    }
  }
]

// list props
const list_props = {
  id: "techset",
  rowHeight: 74.0,
  footer: {
    type: "label",
    props: {
      height: 40,
    }
  },
  template: list_templete
}

// list detail
const list_detail_action = {
  didSelect: function(tableView, indexPath) {
    $ui.loading(true)
    $http.get({
      url: "https://app.kangzubin.com/iostips/api/feed/detail?fid=" + tableView.object(indexPath).fid,
      handler: function(resp) {
        $ui.loading(false)
        var data = resp.data
        if (data.code == 0) {
          $ui.push({
            props: {
              title: tableView.object(indexPath).title.text,
            },
            views: [
              {
                type: "markdown",
                props: {
                  content: data.data.feed.content
                },
                layout: $layout.fill
              }
            ]
          })
       } else {
         $ui.toast("网络异常")
       } 
      }
    });
  },

  pulled: function(sender) {
      page = 1;
      fetchListData(page);
  },

  didReachBottom: function(sender) {
    // fetchListData(page+1);
  }
}

const about_us_label = {
  type: "label",
  props: {
    id: "about_us",
    text: "关于我们",
    align: $align.center,
    textColor: $color("#FFFFFF"),
    bgcolor: $color("tint"),
    font: $font("bold", 18),
  },
  layout: function(make, view) {
    make.left.right.bottom.equalTo(view.super)
    make.height.equalTo(44)
  },
  events: {
    tapped: function(sender) {
      $ui.push({
        props: {
          title: "关于我们"
        },
        views: [
          {
            type: "markdown",
            props: {
              content: about_us_content
            },
            layout: $layout.fill
          }
        ]
      })
    }
  }
}

// main list
const main_list_view = {
  type: "list",
  props: list_props,
  layout: function(make, view) {
    make.left.right.top.equalTo(view.super)
    make.bottom.equalTo($("about_us").top)
  },
  events: list_detail_action
}

$ui.render({
    props: {
      title: "知识小集"
    },
    views: [about_us_label, main_list_view]
})
    
// fetch list data
function fetchListData(p) {
    $http.post({
      url: "https://app.kangzubin.com/iostips/api/feed/list?page=" + p,
      header: {
        from: "ios-app",
        version: "1.0"
      },
      handler: function(resp) {
        var data = resp.data;
        if (p == 1) {
          $("techset").endRefreshing()
        } else {
          $("techset").endFetchingMore();
        }
        if (data['code'] == 0) {
          var tip_list = p == 1 ? [] : $("techset").data

          var tips = data.data.feeds
          if (tips.length == 0) {
            return
          }

          p += 1;

          for (var i in tips) {
            var atip = tips[i]
            var icon = icon_map[atip.author]
            if (icon.length == 0 || icon == "undefine") {
              icon = "https://avatars3.githubusercontent.com/u/36131172?s=200&v=4"
            }
            var d = {
              title: {
                text: atip.title
              },
              author: {
                text: "作者：" +  atip.author
              },
              cover: {
                src: icon
              },
              url: atip.url,
              fid: atip.fid,
              postdate: {
                text: atip.postdate
              }
            }
            tip_list.push(d)
           }
           $("techset").data = tip_list
        } 
      }
    })
}

(function main() {
  fetchListData(page);
})()