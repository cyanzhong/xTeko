function escapeHtml(str) {
  if (str.match(/\\u/))
    str = unescape(str.replace(/\\u/g, '%u'))
  return str.replace(/\\/g, "").replace(/&amp;/g, "&").replace(/&(quot|apos);.*$/, "")
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
      match.forEach(
        function(value) {
          var matchNew = decodeURIComponent(value).match(/https?\:\\?\/\\?\/[^\s"';]+?mp4[^\s"';]*/g)
          if (matchNew != null) {
            matchNew.forEach(
              function(v) {
                list.push(v)
              }
            )
          }
        }
      )
      return list.length > 0 ? list : null
    }
  } else {
    return match
  }
}

function handleTableSelect(url) {
  $ui.toast("Downloading ...")
  $ui.loading(true)
  $http.download({
    url: url,
    handler: function(resp) {
      $ui.loading(false)
      if (resp.response.statusCode == "200") {
        $ui.toast("Download succeeded.")
        $device.taptic(1)
        $quicklook.open({
          type: "mp4",
          data: resp.data,
          handler: function() {
            $ui.alert({
              title: "More",
              message: "What else to do ?",
              actions: [{
                  title: "Save Link to Clipboard",
                  handler: function() {
                    $clipboard.text = url
                    $ui.toast("Link saved.")
                  }
                },
                {
                  title: "Open Share Sheet",
                  handler: function() {
                    $share.sheet([
                      "download.mp4",
                      resp.data
                    ])
                  }
                },
                {
                  title: "Cancel",
                  style: "Cancel"
                }
              ]
            })
          }
        })
      } else {
        $ui.toast("Download failed.")
        $ui.alert({
          title: resp.response.statusCode,
          message: "Invalid URL, please try to edit it."
        })
      }
    }
  })
}

function editorView(text) {
  $ui.push({
    props: {
      title: "Link Editor"
    },
    views: [{
        type: "label",
        props: {
          text: "URL VIEW",
          id: "url",
          font: $font(14),
          textColor: $color("#839595")
        },
        layout: function(make) {
          make.top.inset(35)
          make.left.right.inset(15)
          make.height.equalTo(15)
        }
      },
      {
        type: "text",
        props: {
          id: "text",
          text: text,
          type: $kbType.url
        },
        layout: function(make) {
          var preView = $("url")
          make.top.equalTo(preView.bottom)
          make.left.right.inset(10)
          make.height.equalTo(250)
        }
      },
      {
        type: "button",
        props: {
          title: "Download",
        },
        layout: function(make) {
          var preView = $("text")
          make.top.equalTo(preView.bottom).inset(20)
          make.left.right.inset(30)
          make.height.equalTo(40)
        },
        events: {
          tapped: function() {
            $("text").blur()
            handleTableSelect($("text").text)
          }
        }
      }
    ]
  })
}

function previewView(text) {
  $ui.push({
    props: {
      title: "Preview Link"
    },
    views: [{
        type: "label",
        props: {
          text: "URL VIEW",
          id: "url",
          font: $font(14),
          textColor: $color("#839595")
        },
        layout: function(make) {
          make.top.inset(35)
          make.left.right.inset(15)
          make.height.equalTo(15)
        }
      },
      {
        type: "text",
        props: {
          id: "text",
          text: text,
          editable: false,
        },
        layout: function(make) {
          var preView = $("url")
          make.top.equalTo(preView.bottom)
          make.left.right.inset(10)
          make.height.equalTo(140)
        }
      },
      {
        type: "label",
        props: {
          text: "MP4 VIEW",
          id: "mp4",
          font: $font(14),
          textColor: $color("#839595")
        },
        layout: function(make) {
          var preView = $("text")
          make.top.equalTo(preView.bottom).inset(30)
          make.left.right.inset(15)
          make.height.equalTo(15)
        }
      },
      {
        type: "web",
        props: {
          url: text,
          id: "web"
        },
        layout: function(make) {
          var preView = $("mp4")
          make.top.equalTo(preView.bottom).inset(10)
          make.left.right.inset(15)
          make.height.equalTo(230)
        }
      },
      {
        type: "label",
        props: {
          text: "•「SWIPE BACK」and click the link to download it\nif it's what you want.",
          lines: 2,
          font: $font(13),
          align: $align.center,
          textColor: $color("#AAAAAA")
        },
        layout: function(make) {
          var preView = $("web")
          make.top.equalTo(preView.bottom).inset(20)
          make.left.right.inset(10)
          make.height.equalTo(40)
        }
      }
    ]
  })
}

function mainView(list) {
  $ui.render({
    props: {
      title: "Universal MP4"
    },
    views: [{
      type: "list",
      props: {
        data: [{
          title: "MP4 List",
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
            text: "•「SWIPE LEFT」and Preview if you are finding link.\n\n•「SWIPE LEFT」and try Edit if the link is incorrect.",
            textColor: $color("#AAAAAA"),
            align: $align.center,
            font: $font(13)
          },
        },
        rowHeight: 80,
        actions: [{
          title: "Edit",
          handler: function(tableView, indexPath) {
            editorView(tableView.object(indexPath).url.text)
          }
        },
        {
          title: "Preview",
          handler: function(tableView, indexPath) {
            previewView(tableView.object(indexPath).url.text)
          }
        }]
      },
      layout: $layout.fill,
      events: {
        didSelect: function(tableView, indexPath) {
          handleTableSelect(tableView.object(indexPath).url.text)
        },
        longPressed: function(sender) {
          $device.taptic(0.5)
          // Preview Link Todo
        },
        pulled: function(sender) {
          $("list").endRefreshing()
          $ui.toast("Closing ...")
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

/* Main */

if (typeof($context.safari) == "undefined") {
  $ui.alert({
    title: "Running Error",
    message: "Universal MP4 should only be run in Safari or any SafariViewController.",
    actions: [{
      title: "OK",
      style: "Cancel",
      handler: function() {
        $context.close()
        $app.close()
      }
    }]
  })
} else {
  var items = tryToMatchMP4($context.safari.items.source)

  if (items == null) {
    $ui.alert({
      title: "No MP4 Found",
      message: "You can try to run again after playing the video.",
      actions: [{
        title: "OK",
        style: "Cancel",
        handler: function() {
          $context.close()
        }
      }]
    })
  } else {
    var list = []
    url = unique(items)
    url.forEach(
      function(value) {
        list.push({ url: { text: value } })
      }
    )
    mainView(list)
  }
}