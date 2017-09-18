$app.hidden = true

var MusicID = new Array()
var MusicName = new Array()

function WidgetView(url) {
  if (url) {
    URL = "http://music.able.cat/player/#" + url
    $widget.preview({ url: URL })
  } else {
    $ui.alert("输入不能为空")
  }
}

function Delay(url) {
  $thread.main({
    delay: 0.5,
    handler: function() {
      WidgetView(url)
    }
  })
}

function Tracwrse(data) {
  for (i in data) {
    if (i <= 11) {
      MusicID[i] = data[i].id
      MusicName[i] = data[i].INFO
    }
  }
}

function Requests(type, text) {
  $ui.toast("正在获取数据...")
  $ui.loading(true)
  $http.get({
    url: "http://music.able.cat/api/?return=JSON&t=" + type + "&id=" + encodeURI(text),
    handler: function(res) {
      Tracwrse(res.data)
      $ui.loading(false)
      $ui.menu({
        items: MusicName,
        handler: function(title, idx) {
          if (type == "wy") {
            Delay(MusicID[idx])
          } else {
            info = "str=" + encodeURI(text) + "&id=" + MusicID[idx]
            Delay(info)
          }
        }
      })
    }
  })
}

function Manual(type) {
  $input.text({
    handler: function(text) {
      if (text) {
        Requests(type, text)
      } else {
        $ui.alert("输入不能为空")
      }
    }
  })
}

function Platform() {
  $ui.menu({
    items: ["QQ音乐", "网易云音乐"],
    handler: function(title, idx) {
      switch (idx) {
        case 0:
          Manual("qq")
          break;
        case 1:
          Manual("wy")
          break;
      }
    }
  })
}

$ui.menu({
  items: ["手动输入", "自动获得", "打开网易云"],
  handler: function(title, idx) {
    URL = $clipboard.links[0]
    switch (idx) {
      case 0:
        Platform("wy")
        break;
      case 1:
        Delay(URL)
        break;
      case 2:
        $app.openURL("orpheus://")
        break;
    }
  }
})
