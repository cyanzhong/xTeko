$app.strings = {
  "en": {
    "main-title": "Image Grabber",
    "btn-grab": "Grab",
    "downloading": "Downloading...",
    "save-all": "Save all",
    "share-all": "Share all",
    "zip-n-share": "Zip & Share",
    "quicklook": "Quick look",
    "tips-message": "Tap image to grab"
  },
  "zh-Hans": {
    "main-title": "抓图",
    "btn-grab": "抓取",
    "downloading": "下载中...",
    "save-all": "保存全部",
    "share-all": "分享全部",
    "zip-n-share": "打包分享",
    "quicklook": "预览全部",
    "tips-message": "点击图片进行抓取"
  },
  "zh-Hant": {
    "main-title": "抓圖",
    "btn-grab": "抓取",
    "downloading": "下載中...",
    "save-all": "保存全部",
    "share-all": "分享全部",
    "zip-n-share": "打包分享",
    "quicklook": "預覽全部",
    "tips-message": "點擊圖片進行抓取"
  }
}

var link = $context.link || $clipboard.link
var files = []

$ui.render({
  props: { title: $l10n("main-title") },
  views: [
    {
      type: "button",
      props: {
        id: "button",
        title: "GO"
      },
      layout: function(make) {
        make.right.top.inset(10)
        make.size.equalTo($size(64, 32))
      },
      events: {
        tapped: function(sender) {
          loadWebView()
        }
      }
    },
    {
      type: "input",
      props: {
        type: $kbType.url,
        text: link
      },
      layout: function(make) {
        make.top.left.inset(10)
        make.right.equalTo($("button").left).offset(-10)
        make.height.equalTo($("button"))
      },
      events: {
        returned: function(sender) {
          loadWebView()
        }
      }
    },
    {
      type: "web",
      props: {
        script: function() {
          function extract(element) {
            var style = getComputedStyle(element, false)
            var props = style["backgroundImage"] || style["background"] || style["content"]
            var matches = props.match(/(https?:\/\/[^ "'()]*)/)
            if (matches) {
              return matches[1]
            }
            return null
          }
          function notify(url) {
            if (url) {
              $notify("prepareImage", { "url": url })
            }
          }
          var elements = document.getElementsByTagName("*")
          for (var i=0; i<elements.length; ++i) {
            var element = elements[i]
            if (element.tagName.toLowerCase() === "img") {
              element.onclick = function(event) {
                notify(event.target.src)
                return false
              }
            } else {
              var url = extract(element)
              if (url) {
                element.onclick = function(event) {
                  notify(extract(event.target))
                }
              }
            }
          }
        }
      },
      layout: function(make) {
        make.top.equalTo($("input").bottom).offset(10)
        make.left.right.equalTo(0)
        make.bottom.inset(180)
      },
      events: {
        didFinish: function(sender) {
          sender.eval({
            script: "window.location.href",
            handler: function(result) {
              $("input").text = result
            }
          })
        },
        prepareImage: function(message) {
          insertImage(message.url)
        }
      }
    },
    {
      type: "view",
      props: { bgcolor: $color("#b2b2b2") },
      layout: function(make) {
        make.left.right.equalTo(0)
        make.bottom.equalTo($("web"))
        make.height.equalTo(0.5)
      }
    },
    {
      type: "matrix",
      props: {
        columns: 5,
        square: true,
        spacing: 10,
        template: [
          {
            type: "image",
            props: { id: "image", },
            layout: $layout.fill
          }
        ]
      },
      layout: function(make) {
        make.left.right.equalTo(0)
        make.top.equalTo($("web").bottom).offset(0.5)
        make.bottom.inset(52)
      },
      events: {
        didSelect: function(sender, indexPath) {
          deleteImage(indexPath)
        }
      }
    },
    {
      type: "button",
      props: { title: $l10n("btn-grab") },
      layout: function(make) {
        make.top.equalTo($("matrix").bottom).offset(10)
        make.left.right.bottom.inset(10)
      },
      events: {
        tapped: function(sender) {
          showMenu()
        }
      }
    },
    {
      type: "label",
      props: {
        id: "tip-view",
        font: $font(17),
        text: $l10n("tips-message"),
        align: $align.center
      },
      layout: function(make) {
        var view = $("matrix")
        make.centerX.equalTo(view)
        make.centerY.equalTo(view).offset(5)
      }
    }
  ]
})

function loadWebView() {
  var input = $("input")
  var link = input.text
  input.blur()
  if (link.lastIndexOf("http", 0) != 0) {
    link = "http://" + link
  }
  $("web").url = link
}

function insertImage(url) {
  $ui.toast($l10n("downloading"))
  $http.download({
    url: url,
    handler: function(resp) {
      var file = resp.data
      if (file) {
        files.push(file)
        if (files.length === 1) {
          $("matrix").data = files.map(function(item) {
            return { image: { data: item } }
          })
        } else {
          $("matrix").insert({
            index: files.length - 1,
            value: { image: { data: file } }
          })
        }
        setTipViewAlpha()
      }
    }
  })
}

function deleteImage(indexPath) {
  files.splice(indexPath.item, 1)
  $("matrix").delete(indexPath)
  setTipViewAlpha()
}

function setTipViewAlpha() {
  var alpha = files.length > 0 ? 0.0 : 1.0
  $ui.animate({
    duration: 0.2,
    animation: function() {
      $("tip-view").alpha = alpha
    }
  })
}

function showMenu() {
  $ui.menu({
    items: [$l10n("save-all"), $l10n("share-all"), $l10n("zip-n-share"), $l10n("quicklook")],
    handler: function(title, idx) {
      switch (idx) {
        case 0: save(); break
        case 1: share(); break
        case 2: zip(); break
        case 3: quicklook(); break
        default: break
      }
    }
  })
}

function save() {
  files.forEach(function(file) {
    $photo.save({ data: file })
  })
}

function share() {
  $share.sheet(files)
}

function zip() {
  var dest = "archive.zip"
  $ui.loading(true)
  $archiver.zip({
    files: files,
    dest: dest,
    handler: function(success) {
      $ui.loading(false)
      if (success) {
        $share.sheet([dest, $file.read(dest)])
      }
    }
  })
}

function quicklook() {
  $quicklook.open({ list: files })
}

if (link) {
  loadWebView()
}