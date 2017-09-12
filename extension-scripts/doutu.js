$ui.render({
  props: {
    title: "U表情包"
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
  var url = "http://www.ubiaoqing.com/search/" + encodeURIComponent(keyword)
  $ui.loading(true)
  $http.get({
    url: url,
    handler: function(resp) {
      $ui.loading(false)
      var html = resp.data
      var regex = /src="(.*?)".*class="img-responsive center-block"/g
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
    return { image: { src: item } }
  })
}

$("input").focus()