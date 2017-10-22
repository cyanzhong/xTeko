$ui.render({
  props: { title: "Twitter Video Downloader" },
  views: [
    {
      type: "web",
      props: {
        url: "http://twittervideodownloader.com/",
        script: function() {
          var images = document.getElementsByClassName("expanded button small float-right")
          for (var i=0; i<images.length; ++i) {
            var element = images[i]
            element.onclick = function(event) {
              var source = event.target || event.srcElement
              $notify("download", {"url": source.href})
              return false
            }
          }
          if (window.location.href.match("download$")) {
            window.scrollTo(0, document.body.scrollHeight)
          }
        }
      },
      layout: $layout.fill,
      events: {
        didFinish: function(sender) {
          var link = $clipboard.link
          if (link) {
            var script = "document.getElementsByClassName('input-group-field')[0].value='" + link + "';document.querySelector('.button[type=submit]').click();"
            sender.eval({script: script})
          }
        },
        download: function(info) {
          $ui.loading(true)
          $http.download({
            url: info.url,
            handler: function(resp) {
              $ui.loading(false)
              $share.sheet(resp.data)
            }
          })
        }
      }
    }
  ]
})