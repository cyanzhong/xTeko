$ui.render({
  props: {
    title: "斗图啦网页版"
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
      type: "web",
      props: {
        script: function() {
          var images = document.getElementsByTagName("img")
          for (var i=0; i<images.length; ++i) {
            var element = images[i]
            element.onclick = function(event) {
              var source = event.target || event.srcElement
              $notify("share", {"url": source.getAttribute("data-original")})
              return false
            }
          }
        }
      },
      layout: function(make) {
        make.left.bottom.right.equalTo(0)
        make.top.equalTo($("input").bottom).offset(10)
      },
      events: {
        share: function(object) {
          $http.download({
            url: "http:" + object.url,
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
  var url = "https://www.doutula.com/search?keyword=" + encodeURIComponent(keyword)
  $("input").blur()
  $("web").url = url
}

$("input").focus()