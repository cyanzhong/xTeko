$app.strings = {
  "en": {
    "link-not-found": "Link not found",
    "invalid-link": "Invalid link",
    "analysing": "Analysing...",
    "analysis-failed": "Analysis failed",
    "downloading": "Downloading..."
  },
  "zh-Hans": {
    "link-not-found": "没有找到链接",
    "invalid-link": "不是 Tweet 链接",
    "analysing": "解析中...",
    "analysis-failed": "解析失败",
    "downloading": "下载中..."
  },
  "zh-Hant": {
    "link-not-found": "沒有找到鏈接",
    "invalid-link": "不是 Tweet 鏈接",
    "analysing": "解析中...",
    "analysis-failed": "解析失敗",
    "downloading": "下載中..."
  }
}

var link = $context.link || $clipboard.link

if (!link) {
  $ui.toast($l10n("link-not-found"))
  return
}

if (link.indexOf("twitter.com") === -1) {
  $ui.toast($l10n("invalid-link"))
  return
}

var found = false

$ui.loading(true)
$ui.toast($l10n("analysing"))

$ui.create({
  type: "web",
  props: {
    hidden: true,
    url: "http://twittervideodownloader.com/",
    script: function() {
      var finished = false
      var worker = function() {
        var elements = document.getElementsByClassName("expanded button small float-right") || []
        if (elements.length > 0 && !finished) {
          var items = []
          for (var i=0; i<elements.length; ++i) {
            var element = elements[i]
            var title = element.parentElement.parentElement.getElementsByClassName("float-left")[0].innerText
            items.push({ title: title, url: element.href })
          }
          $notify("showMenu", { items: items })
          clearInterval(timer)
          finished = true
        }
      }
      worker()
      var timer = setInterval(worker, 500)
    }
  },
  layout: $layout.fill,
  events: {
    didFinish: function(sender) {
      var script = "document.getElementsByClassName('input-group-field')[0].value='" + link + "';document.querySelector('.button[type=submit]').click();"
      sender.eval({script: script})
    },
    showMenu: function(info) {
      found = true
      $ui.loading(false)
      $ui.menu({
        items: info.items.map(function(item) { return item.title }),
        handler: function(title, idx) {
          download(info.items[idx].url)
        }
      })
    }
  }
})

function download(url) {
  $ui.loading(true)
  $ui.toast($l10n("downloading"))
  $http.download({
    url: url,
    handler: function(resp) {
      $ui.loading(false)
      $share.sheet(resp.data)
    }
  })
}

$thread.main({
  delay: 30,
  handler: function() {
    $ui.loading(false)
    if (!found) {
      $ui.toast($l10n("analysis-failed"))
    }
  }
})