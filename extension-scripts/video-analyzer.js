$app.strings = {
  "en": {
    "link-not-found": "Link not found",
    "initializing": "initializing...",
    "random": "Random Server",
    "east-usa": "East USA Server",
    "mid-uk": "Mid UK Server",
    "tokyo-japan": "Tokyo, Japan Server",
    "west-usa": "West USA Server",
    "analysing": "Analysing...",
    "analysis-failed": "Analysis failed",
    "copy-link": "Copy link",
    "copied": "Copied",
    "download": "Download",
    "downloading": "Downloading..."
  },
  "zh-Hans": {
    "link-not-found": "没有找到链接",
    "initializing": "初始化...",
    "random": "随机选择服务器",
    "east-usa": "美国东部服务器",
    "mid-uk": "英国伦敦服务器",
    "tokyo-japan": "日本东京服务器",
    "west-usa": "美国西部服务器",
    "analysing": "解析中...",
    "analysis-failed": "解析失败",
    "copy-link": "复制链接",
    "copied": "已复制",
    "download": "下载视频",
    "downloading": "下载中..."
  },
  "zh-Hant": {
    "link-not-found": "沒有找到鏈接",
    "initializing": "初始化...",
    "random": "隨機選擇服務器",
    "east-usa": "美國東部服務器",
    "mid-uk": "英國倫敦服務器",
    "tokyo-japan": "日本東京服務器",
    "west-usa": "美國西部服務器",
    "analysing": "解析中...",
    "analysis-failed": "解析失敗",
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

function analyze(url) {
  $ui.toast($l10n("analysing"))
  $ui.loading(true)
  $http.get({
    url: url,
    handler: function(resp) {
      $ui.loading(false)
      var urls = resp.data.urls
      var url = resp.data.url
      if (urls.length > 0) {
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
        $ui.toast($l10n("downloading"))
        $http.download({
          url: url,
          handler: function(resp) {
            $share.sheet(resp.data)
          }
        })
      }
    }
  })
}

$ui.toast($l10n("initializing"))
$http.get({
  url: "https://weibomiaopai.com",
  handler: function(resp) {
    var match = /var +hash *= *\"(.+)\";/.exec(resp.data)
    var hash = match[1]
    $ui.menu({
      items: [$l10n("random")].concat(options.map(function(item) { return item.name })),
      handler: function(title, idx) {
        var index = idx == 0 ? Math.floor(Math.random() * 4) : idx - 1
        var server = options[index].server
        var url = "https://" + server + "/api/video/?cached&lang=ch&hash=" + hash + "&video=" + encodeURIComponent(link)
        analyze(url)
      }
    })
  }
})