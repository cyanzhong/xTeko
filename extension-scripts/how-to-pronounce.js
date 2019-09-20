$app.strings = {
  "en": {
    "placeholder": "Enter word or name",
    "loading": "Loading...",
    "no-result": "No result"
  },
  "zh-Hans": {
    "placeholder": "输入单词或名字",
    "loading": "加载中...",
    "no-result": "没找到结果"
  },
  "zh-Hant": {
    "placeholder": "輸入單詞或名字",
    "loading": "加載中...",
    "no-result": "沒找到結果"
  }
}

function query(text) {
  text = text.split(" ").filter(function(item) { return item.length > 0 }).join("-")
  $ui.toast($l10n("loading"))
  $http.get({
    url: "https://www.howtopronounce.com/" + encodeURIComponent(text),
    handler: function(resp) {
      if (resp.data) {
        parse(resp.data)
      }
    }
  })
}

function parse(html) {

  var regex = /data-id="(.*mp3?)"/g
  var links = []
  var match = regex.exec(html)

  while (match != null) {
    var temp = match[1]
    if (links.indexOf(temp) === -1) {
      links.push(temp)
    }
    match = regex.exec(html)
  }

  if (links.length > 0) {
    $ui.menu({
      items: links,
      handler: function(title, idx) {
        $ui.toast($l10n("loading"))
        $audio.play({ url: links[idx] })
      }
    })
  } else {
    $ui.toast($l10n("no-result"))
  }
}

if ($context.text) {
  query($context.text)
} else {
  $input.text({
    type: $kbType.ascii,
    text: $clipboard.text,
    placeholder: $l10n("placeholder"),
    handler: function(text) {
      query(text)
    }
  })
}