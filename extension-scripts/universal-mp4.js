$app.strings = {
  "en": {
    "title1": "More",
    "title2": "Save Link to Clipboard",
    "title3": "Open Share Sheet",
    "title4": "Cancel",
    "title5": "Link Editor",
    "title6": "URL VIEW",
    "title7": "Download",
    "title8": "Preview Link",
    "title9": "URL VIEW",
    "title10": "MP4 VIEW",
    "title11": "Universal MP4",
    "title12_1": "MP4 List (",
    "title12_2": ")",
    "title13": "Edit",
    "title14": "Preview",
    "title15": "No MP4 Found",
    "title16": "OK",
    "title17": "Running Error",
    "title18": "OK",
    "text1": "•「SWIPE BACK」and click the link to download it\nif it's what you want.",
    "text2": "•「SWIPE LEFT」and Preview if you are finding link.\n\n•「SWIPE LEFT」and try Edit if the link is incorrect.",
    "msg1": "What else to do ?",
    "msg2": "Invalid URL, please try to edit it.",
    "msg3": "Universal MP4 strongly recommend you to run in Safari or any SafariViewController.\n\nIn that way, we can get dynamic web source other than static HTTP source.",
    "toast1": "Downloading ...",
    "toast2": "Download succeeded.",
    "toast3": "Link saved.",
    "toast4": "Download failed.",
    "toast5": "Closing ...",
    "toast6": "Trying to get HTTP source ...",
    "va1": "Universal MP4 strongly recommend you to run in Safari or any SafariViewController.\n\nIn that way, we can get dynamic web source other than static HTTP source.",
    "va2": "You can try to run again after playing the video."
  },
  "zh-Hans": {
    "title1": "更多",
    "title2": "保存链接到剪切板",
    "title3": "打开分享菜单",
    "title4": "取消",
    "title5": "链接编辑",
    "title6": "URL 显示",
    "title7": "下载",
    "title8": "链接预览",
    "title9": "URL 显示",
    "title10": "MP4 显示",
    "title11": "Universal MP4",
    "title12_1": "MP4 列表 (",
    "title12_2": ")",
    "title13": "修改",
    "title14": "预览",
    "title15": "未捕获 MP4",
    "title16": "好的",
    "title17": "运行错误",
    "title18": "好的",
    "text1": "•「右划返回」并点击您想要的链接以下载。",
    "text2": "•「左划」并预览以快速寻找链接。\n\n•「左划」并尝试修改错误链接。",
    "msg1": "您还可以",
    "msg2": "无效链接，请尝试修改。",
    "msg3": "Universal MP4 强烈建议您在 Safari 或任何 SafariViewController 运行。\n\n否则，我们只能获取静态 HTTP 资源而非动态网页源码。",
    "toast1": "正在下载 ...",
    "toast2": "下载成功。",
    "toast3": "链接已保存。",
    "toast4": "下载失败。",
    "toast5": "正在关闭 ...",
    "toast6": "正在尝试获取 HTTP 资源  ...",
    "va1": "Universal MP4 强烈建议您在 Safari 或任何 SafariViewController 运行。\n\n否则，我们只能获取静态 HTTP 资源而非动态网页源码。",
    "va2": "您可以播放视频后再尝试运行。"
  }
}


function escapeHtml(str) {
  if (str.match(/\\u/))
    str = unescape(str.replace(/\\u/g, '%u'))
  return str.replace(/\\/g, "").replace(/amp;/g, "").replace(/&(quot|apos);.*$/, "")
}

function unique(array) {
  var r = [];
  for (var i = 0, l = array.length; i < l; i++) {
    for (var j = i + 1; j < l; j++) {
      if (escapeHtml(array[i]) === escapeHtml(array[j]))
        j = ++i
    }
    r.push(escapeHtml(array[i]))
  }
  return r
}

function tryToMatchMP4(source) {
  // Try to match direct links
  var match = source.match(/https?\:\\?\/\\?\/[^\s"']+?mp4[^\s"']*/g)
  if (match == null) {
    // Try to match encoded links
    match = source.match(/https%3a%2f%2f[^\s"']+?mp4[^\s"']*/ig)
    if (match == null) {
      return null
    } else {
      var list = []
      for (var i of match) {
        var matchNew = decodeURIComponent(value).match(/https?\:\\?\/\\?\/[^\s"';]+?mp4[^\s"';]*/g)
        if (matchNew != null) {
          for (var j of matchNew) {
            list.push(j)
          }
        }
      }
      return list.length > 0 ? list : null
    }
  } else {
    return match
  }
}

function handleTableSelect(url) {
  $ui.toast($l10n("toast1"))
  $ui.loading(true)
  $http.download({
    url: url,
    handler: function(resp) {
      $ui.loading(false)
      if (resp.response.statusCode == "200") {
        $ui.toast($l10n("toast2"))
        $device.taptic(1)
        $quicklook.open({
          type: "mp4",
          data: resp.data,
          handler: function() {
            $ui.alert({
              title: $l10n("title1"),
              message: $l10n("msg1"),
              actions: [{
                  title: $l10n("title2"),
                  handler: function() {
                    $clipboard.text = url
                    $ui.toast($l10n("toast3"))
                  }
                },
                {
                  title: $l10n("title3"),
                  handler: function() {
                    $share.sheet([
                      "download.mp4",
                      resp.data
                    ])
                  }
                },
                {
                  title: $l10n("title4"),
                  style: "Cancel"
                }
              ]
            })
          }
        })
      } else {
        $ui.toast($l10n("toast4"))
        $ui.alert({
          title: resp.response.statusCode,
          message: $l10n("msg2")
        })
      }
    }
  })
}

function editorView(text) {
  $ui.push({
    props: {
      title: $l10n("title5")
    },
    views: [{
      type: "list",
      props: {
        scrollEnabled: false,
        data: [{
          title: $l10n("title6"),
          rows: [{
            type: "text",
            props: {
              text: text
            },
            layout: function(make) {
              make.left.right.inset(5)
              make.height.equalTo(250)
            }
          }]
        }],
        footer: {
          props: {
            height: 40
          },
          views: [{
            type: "button",
            props: {
              title: $l10n("title7")
            },
            layout: function(make) {
              make.left.right.inset(30)
              make.height.equalTo(40)
            },
            events: {
              tapped: function() {
                $("text").blur()
                handleTableSelect($("text").text)
              }
            }
          }]
        },
        rowHeight: 250
      },
      layout: $layout.fill
    }]
  })
}

function previewView(text) {
  $ui.push({
    props: {
      title: $l10n("title8")
    },
    views: [{
      type: "list",
      props: {
        scrollEnabled: false,
        data: [{
            title: $l10n("title9"),
            rows: [{
              type: "text",
              props: {
                text: text,
                editable: false,
              },
              layout: function(make) {
                make.left.right.inset(5)
                make.height.equalTo(140)
              }
            }]
          },
          {
            title: $l10n("title10"),
            rows: [{
              type: "web",
              props: {
                url: text
              },
              layout: function(make) {
                make.left.right.inset(0)
                make.height.equalTo(230)
              }
            }]
          }
        ],
        footer: {
          type: "label",
          props: {
            height: 40,
            text: $l10n("text1"),
            lines: 2,
            font: $font(13),
            align: $align.center,
            textColor: $color("#AAAAAA")
          }
        }
      },
      layout: $layout.fill,
      events: {
        rowHeight: function(sender, indexPath) {
          if (indexPath.section == 0)
            return 140.0
          else
            return 230.0
        }
      }
    }]
  })
}

function mainView(list) {
  $ui.render({
    props: {
      title: $l10n("title11")
    },
    views: [{
      type: "list",
      props: {
        data: [{
          title: $l10n("title12_1") + list.length + $l10n("title12_2"),
          rows: list,
          id: "list"
        }],
        template: [{
          type: "label",
          props: {
            id: "url",
            font: $font(12),
            lines: 4
          },
          layout: function(make) {
            make.left.right.inset(10)
            make.top.bottom.inset(5)
          }
        }],
        footer: {
          type: "label",
          props: {
            height: 60,
            lines: 0,
            text: $l10n("text2"),
            textColor: $color("#AAAAAA"),
            align: $align.center,
            font: $font(13)
          }
        },
        rowHeight: 80,
        actions: [{
            title: $l10n("title13"),
            handler: function(tableView, indexPath) {
              editorView(tableView.object(indexPath).url.text)
            }
          },
          {
            title: $l10n("title14"),
            handler: function(tableView, indexPath) {
              previewView(tableView.object(indexPath).url.text)
            }
          }
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect: function(tableView, indexPath) {
          handleTableSelect(tableView.object(indexPath).url.text)
        },
        longPressed: function(sender) {
          $device.taptic(0.5)
          // Todo: Link to clipboard
        },
        pulled: function(sender) {
          $("list").endRefreshing()
          $ui.toast($l10n("toast5"))
          $thread.main({
            delay: 0.8,
            handler: function() {
              $context.close()
            }
          })
        }
      }
    }]
  })
}

function main(items, message) {
  if (items == null) {
    $ui.alert({
      title: $l10n("title15"),
      message: message,
      actions: [{
        title: $l10n("title16"),
        style: "Cancel",
        handler: function() {
          $context.close()
          $app.close()
        }
      }]
    })
  } else {
    var list = []
    url = unique(items)
    for (var i of url) {
      list.push({ url: { text: i } })
    }
    mainView(list)
  }
}

/* Main */

if (typeof($context.safari) == "undefined") {
  var url = $context.link || $clipboard.link ? $context.link || $clipboard.link : ""

  if (url.match(/https?\:\/\/.+/i)) {
    $ui.toast($l10n("toast6"))
    $ui.loading(true)
    $http.get({
      url: url,
      handler: function(resp) {
        $ui.loading(false)
        var items = tryToMatchMP4(resp.data)
        var message = $l10n("va1")
        main(items, message)
      }
    })
  } else {
    $ui.alert({
      title: $l10n("title17"),
      message: $l10n("msg3"),
      actions: [{
        title: $l10n("title18"),
        style: "Cancel",
        handler: function() {
          $context.close()
          $app.close()
        }
      }]
    })
  }
} else {
  var items = tryToMatchMP4($context.safari.items.source)
  var message = $l10n("va2")
  main(items, message)
}
