$app.strings = {
  "en": {
    "placeholder": "Enter word or name",
    "loading": "Loading..."
  },
  "zh-Hans": {
    "placeholder": "输入单词或名字",
    "loading": "加载中..."
  },
  "zh-Hant": {
    "placeholder": "輸入單詞或名字",
    "loading": "加載中..."
  }
}

$input.text({
  type: $kbType.ascii,
  text: $context.text || $clipboard.text,
  placeholder: $l10n("placeholder"),
  handler: function(text) {
    query(text.split(" ").filter(function(item) { return item.length > 0 }).join("-"))
  }
})

function query(text) {
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

  $ui.menu({
    items: links,
    handler: function(title, idx) {
      $ui.toast($l10n("loading"))
      $audio.play({ url: links[idx] })
    }
  })
}