$app.strings = {
  "en": {
    "link-not-found": "Link not found",
    "random": "Random Server",
    "east-usa": "East USA Server",
    "mid-uk": "Mid UK Server",
    "tokyo-japan": "Tokyo, Japan Server",
    "west-usa": "West USA Server",
    "analysing": "Analysing...",
    "copy-link": "Copy link",
    "copied": "Copied",
    "download": "Download",
    "downloading": "Downloading..."
  },
  "zh-Hans": {
    "link-not-found": "没有找到链接",
    "random": "随机选择服务器",
    "east-usa": "美国东部服务器",
    "mid-uk": "英国伦敦服务器",
    "tokyo-japan": "日本东京服务器",
    "west-usa": "美国西部服务器",
    "analysing": "解析中...",
    "copy-link": "复制链接",
    "copied": "已复制",
    "download": "下载视频",
    "downloading": "下载中..."
  },
  "zh-Hant": {
    "link-not-found": "沒有找到鏈接",
    "random": "隨機選擇服務器",
    "east-usa": "美國東部服務器",
    "mid-uk": "英國倫敦服務器",
    "tokyo-japan": "日本東京服務器",
    "west-usa": "美國西部服務器",
    "analysing": "解析中...",
    "copy-link": "複製鏈接",
    "copied": "已復制",
    "download": "下載視頻",
    "downloading": "下載中..."
  }
}

var options = [
  { name: $l10n("east-usa"), server: "helloacm.com" },
  { name: $l10n("mid-uk"), server: "uploadbeta.com" },
  { name: $l10n("tokyo-japan"), server: "happyukgo.com" },
  { name: $l10n("west-usa"), server: "steakovercooked.com" }
]

var link = $context.link || $clipboard.link

if (!link) {
  $ui.toast($l10n("link-not-found"))
  return
}

function render(server) {
  $ui.loading($l10n("analysing"))
  $thread.main({
    delay: 60,
    handler: function() {
      $ui.loading(false)
    }
  })
  $ui.create({
    views: [
      {
        type: "web",
        props: {
          url: "https://weibomiaopai.com/",
          script: function() {
            var worker = function() {
              var blockquote = document.getElementById("down").querySelector("blockquote")
              if (blockquote) {
                var elements = blockquote.querySelectorAll("a")
                var items = []
                for (var i=0; i<elements.length; ++i) {
                  var element = elements[i]
                  items.push(element.href)
                }
                $notify("showResult", {"items": items})
                clearInterval(timer)
              }
            }
            worker()
            var timer = setInterval(worker, 500)
          }
        },
        events: {
          didFinish: function(sender) {
            var script = "document.getElementById('weibourl').value='" + link + "';document.getElementById('server').value='" + server + "';document.getElementById('input-submit').click();"
            sender.eval({script: script})
          },
          showResult: function(message) {
            $ui.loading(false)
            var urls = message.items
            var url = urls[0]
            if (urls.length > 1) {
              $ui.menu({
                items: urls,
                handler: function(title, idx) {
                  finalize(urls[idx])
                }
              })
            } else if (url) {
              finalize(url)
            } else {
              $ui.toast($l10n("analysis-failed"))
            }
          }
        }
      }
    ]
  })
}

function finalize(url) {
  $ui.menu({
    items: [$l10n("copy-link"), $l10n("download")],
    handler: function(title, idx) {
      if (idx == 0) {
        $ui.toast($l10n("copied"))
        $clipboard.text = url
      } else {
        $http.download({
          url: url,
          message: $l10n("downloading"),
          handler: function(resp) {
            $share.sheet(resp.data)
          }
        })
      }
    }
  })
}

$ui.menu({
  items: [$l10n("random")].concat(options.map(function(item) { return item.name })),
  handler: function(title, idx) {
    var index = idx == 0 ? Math.floor(Math.random() * 4) : idx - 1
    var server = options[index].server
    render(server)
  }
})