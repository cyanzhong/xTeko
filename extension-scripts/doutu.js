$ui.render({
  props: {
    title: "斗图啦"
  },
  views: [
    {
      type: "button",
      props: {
        title: "搜索"
      },
      layout: function(make) {
        make.right.top.inset(10)
        make.size.equalTo($size(64, 32))
      },
      events: {
        tapped: function(sender) {
          search()
        }
      }
    },
    {
      type: "input",
      props: {
        placeholder: "输入关键字"
      },
      layout: function(make) {
        make.top.left.inset(10)
        make.right.equalTo($("button").left).offset(-10)
        make.height.equalTo($("button"))
      },
      events: {
        returned: function(sender) {
          search()
        }
      }
    },
    {
      type: "matrix",
      props: {
        columns: 4,
        itemHeight: 88,
        spacing: 10,
        template: [
          {
            type: "image",
            props: {
              id: "image",
            },
            layout: $layout.fill
          }
        ]
      },
      layout: function(make) {
        make.left.bottom.right.equalTo(0)
        make.top.equalTo($("input").bottom).offset(10)
      },
      events: {
        didSelect: function(sender, indexPath, object) {
          $http.download({
            url: object.image.src,
            handler: function(resp) {
              $share.universal(resp.data)
            }
          })
        }
      }
    }
  ]
})

function search() {
  var keyword = $("input").text
  $("input").blur()
  var url = "https://www.doutula.com/search?keyword=" + encodeURIComponent(keyword)
  $ui.loading(true)
  $http.request({
    method: "GET",
    url: url,
    header: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 Mobile/14G60 Safari/602.1"
    },
    handler: function(resp) {
      $ui.loading(false)
      var html = resp.data
      var regex = /original="(.*?)"/g
      var data = []
      var match = regex.exec(html)
      while (match != null) {
        data.push(match[1])
        match = regex.exec(html)
      }
      render(data)
    }
  })
}

function render(data) {
  $("matrix").data = data.map(function(item) {
    if (item.indexOf("http") != 0) {
      item = "http:" + item
    }
    return { image: { src: item } }
  })
}

$("input").focus()
