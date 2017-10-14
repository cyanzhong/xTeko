var engines = 
[
  {
    name: "M-W",
    pattern: "http://merriam-webster.com/dictionary/"
  },
  {
    name: "Free Dictionary",
    pattern: "http://idioms.thefreedictionary.com/"
  },
  {
    name: "WolframAlpha",
    pattern: "http://m.wolframalpha.com/input/?i="
  },
  {
    name: "Urban",
    pattern: "https://www.urbandictionary.com/define.php?term="
  }
]

if ($context.text) {
  $thread.main({
    delay: 0.3,
    handler: function() {
      showEngines($context.text)
    }
  })
} else {
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