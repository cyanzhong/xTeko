$ui.render({
  props: {
    title: "Downloader"
  },
  views: [
    {
      type: "button",
      props: {
        title: "下载"
      },
      layout: function(make) {
        make.right.top.inset(10)
        make.size.equalTo($size(64, 32))
      },
      events: {
        tapped: function(sender) {
          download()
        }
      }
    },
    {
      type: "input",
      props: {
        type: $kbType.url,
        placeholder: "输入地址"
      },
      layout: function(make) {
        make.top.left.inset(10)
        make.right.equalTo($("button").left).offset(-10)
        make.height.equalTo($("button"))
      },
      events: {
        ready: function(sender) {
          sender.text = $clipboard.text
          sender.focus()
        },
        returned: function(sender) {
          download()
        }
      }
    }
  ]
})

function download() {
  var url = $("input").text
  $ui.toast("开始下载: " + url)
  $ui.loading(true)
  $http.download({
    url: url,
    handler: function(resp) {
      $ui.loading(false)
      $share.sheet(resp.data)
    }
  })
}