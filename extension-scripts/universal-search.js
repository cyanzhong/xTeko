var engines = [
  {
    name: "谷歌",
    pattern: "https://www.google.com/#newwindow=1&q="
  },
  {
    name: "必应",
    pattern: "http://cn.bing.com/search?q="
  },
  {
    name: "百度",
    pattern: "https://www.baidu.com/s?wd="
  },
  {
    name: "搜狗",
    pattern: "https://www.sogou.com/web?query="
  },
  {
    name: "雅虎",
    pattern: "https://search.yahoo.com/search?p="
  }
]

if ($context.text) {
  $thread.main({
    delay: 0.3,
    handler: function() {
      showEngines($context.text)
    }
  })
} else if ($clipboard.text) {
  $ui.menu({
    items: ["搜索剪贴板", "输入内容"],
    handler: function(title, idx) {
      if (idx == 0) {
        showEngines($clipboard.text)
      } else {
        $input.text({
          handler: function(text) {
            showEngines(text)
          }
        })
      }
    }
  })
}

function showEngines(text) {
  $ui.menu({
    items: engines.map(function(item) { return item.name }),
    handler: function(title, idx) {
      $thread.main({
        delay: 0.4,
        handler: function() {
          search(engines[idx].pattern, text)
        }
      })
    }
  })
}

function search(pattern, text) {
  $safari.open({ url: pattern + encodeURIComponent(text) })
}