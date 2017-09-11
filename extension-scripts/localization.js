$app.strings = {
  "en": {
    "title1": "Localization",
    "title2": "Pre-Transfer",
    "title3": "Raw JS Code",
    "title4": "Modification",
    "title5": "Re-Transfer",
    "title6": "Pre Transfer Result",
    "title7": "Paste The Lines to Re-Transfer",
    "title8": "Localization",
    "title9": "Save Codes to Clipboard",
    "title10": "JS Code",
    "text1": "• Paste codes you want above.",
    "text2": "• Text of variables, arrays and objects should be detected manually, just repeat selecting lines and unselecting.\n• Keep blank if there's no need for modification.",
    "text3": "• Make edition for the languages, then save as clipboaed text.",
    "toast1": "Clipboard saved."
  },
  "zh-Hans": {
    "title1": "Localization",
    "title2": "格式预转换",
    "title3": "原始 JS 代码",
    "title4": "Modification",
    "title5": "格式再转换",
    "title6": "预结果",
    "title7": "粘贴行代码以再转换",
    "title8": "Localization",
    "title9": "保存代码到剪切板",
    "title10": "JS 代码",
    "text1": "• 粘贴需要生成格式的代码",
    "text2": "• 变量、数组、对象的文本需要手动检测，反复选择需要再转换的行代码和取消选择即可。\n• 如无需要再转换的行代码，请留空。",
    "text3": "• 编辑本地化语言，点击保存代码到剪切板。",
    "toast1": "已保存到剪切板。"
  }
}

function mainView() {
  $ui.render({
    props: {
      title: $l10n("title1")
    },
    views: [{
        type: "button",
        props: {
          title: $l10n("title2")
        },
        layout: function(make) {
          make.left.right.inset(55)
          make.bottom.inset(5)
          make.height.equalTo(35)
        },
        events: {
          tapped: function() {
            localize($("raw").text)
          }
        }
      },
      {
        type: "list",
        props: {
          data: [{
            title: $l10n("title3"),
            rows: [{
              type: "text",
              props: {
                id: "raw",
                text: $clipboard.items[0]["public.utf8-plain-text"]
              },
              layout: function(make, view) {
                make.left.right.inset(5)
                make.height.equalTo(450)
              }
            }]
          }],
          footer: {
            type: "label",
            props: {
              height: 15,
              lines: 1,
              align: $align.center,
              font: $font(13),
              textColor: $color("#AAAAAA"),
              text: $l10n("text1")
            }
          },
          rowHeight: 450
        },
        layout: function(make) {
          var preView = $("button")
          make.bottom.equalTo(preView.top).offset(-5)
          make.left.top.right.inset(0)
        }
      }
    ]
  })
}

function modiView(code, preTrans, preCode) {
  $ui.push({
    props: {
      title: $l10n("title4")
    },
    views: [{
        type: "button",
        props: {
          title: $l10n("title5")
        },
        layout: function(make) {
          make.left.right.inset(55)
          make.bottom.inset(5)
          make.height.equalTo(35)
        },
        events: {
          tapped: function() {
            relocalize(preCode, $("lines").text, preTrans, code)
          }
        }
      },
      {
        type: "list",
        props: {
          data: [{
              title: $l10n("title6"),
              rows: [{
                type: "text",
                props: {
                  editable: false,
                  text: code
                },
                layout: function(make) {
                  make.left.right.inset(5)
                  make.height.equalTo(300)
                },
                events: {
                  didChangeSelection: function(sender) {
                    var range = sender.selectedRange
                    var sub = code.substr(range.location, range.length)
                    if ("" == sub) {
                      $("lines").text += "\n"
                      totalLines = $("lines").text
                    } else {
                      if ("" == preLine)
                        totalLines = $("lines").text
                      $("lines").text = totalLines + sub
                    }
                    preLine = sub
                  }
                }
              }]
            },
            {
              title: $l10n("title7"),
              rows: [{
                type: "text",
                props: {
                  id: "lines"
                },
                layout: function(make) {
                  make.left.right.inset(5)
                  make.height.equalTo(100)
                }
              }]
            }
          ],
          footer: {
            props: {
              height: 50
            },
            views: [{
              type: "label",
              props: {
                lines: 0,
                //align: $align.center,
                font: $font(13),
                textColor: $color("#AAAAAA"),
                text: $l10n("text2")
              },
              layout: function(make) {
                make.left.right.inset(20)
                make.height.equalTo(50)
              }
            }]
          }
        },
        layout: function(make) {
          var preView = $("button")
          make.bottom.equalTo(preView.top).offset(-5)
          make.left.top.right.inset(0)
        },
        events: {
          rowHeight: function(sender, indexPath) {
            if (indexPath.section == 0)
              return 300
            else
              return 100
          }
        }
      }
    ]
  })
}

function finalView(code) {
  $ui.push({
    props: {
      title: $l10n("title8")
    },
    views: [{
        type: "button",
        props: {
          title: $l10n("title9")
        },
        layout: function(make) {
          make.left.right.inset(55)
          make.bottom.inset(5)
          make.height.equalTo(35)
        },
        events: {
          tapped: function() {
            $ui.toast($l10n("toast1"))
            $clipboard.text = $("final").text
          }
        }
      },
      {
        type: "list",
        props: {
          data: [{
            title: $l10n("title10"),
            rows: [{
              type: "text",
              props: {
                id: "final",
                text: code
              },
              layout: function(make, view) {
                make.left.right.inset(5)
                make.height.equalTo(450)
              }
            }]
          }],
          footer: {
            type: "label",
            props: {
              height: 20,
              lines: 2,
              align: $align.center,
              font: $font(13),
              textColor: $color("#AAAAAA"),
              text: $l10n("text3")
            }
          },
          rowHeight: 450
        },
        layout: function(make) {
          var preView = $("button")
          make.bottom.equalTo(preView.top).offset(-5)
          make.left.top.right.inset(0)
        }
      }
    ]
  })
}

function unique(array) {
  var r = [];
  for (var i = 0, l = array.length; i < l; i++) {
    for (var j = i + 1; j < l; j++) {
      if (array[i] === array[j])
        j = ++i
    }
    r.push(array[i])
  }
  return r
}

function localize(code) {
  var str = []
  var nodes1 = {
    "title": "title",
    "text": "text",
    "message": "msg",
    "placeholder": "ph"
  }
  var nodes2 = {
    "alert": "alert",
    "toast": "toast"
  }

  /* execute nodes1 string */
  for (var key in nodes1) {
    var value = nodes1[key]
    for (var i = 1;; i++) {
      var re = eval('/(' + key + ':[^"\'$\\n]*)(["\'][^$\\n]+["\'])/i')
      if (!re.test(code))
        break
      code = code.replace(re, function($0, $1, $2) {
        re = /([^\\]|^)(["'].*?[^\\]["'])/ig
        if ($2.match(re).length > 1) {
          var j = 0
          var innerReplace = $2.replace(re, function($10, $11, $12) {
            j++
            str.push("    \"" + value + i + "_" + j + "\": " + $12)
            return $11 + '$l10n("' + value + i + "_" + j + '")'
          })
          return $1 + innerReplace
        } else {
          str.push("    \"" + value + i + "\": " + $2)
          return $1 + '$l10n("' + value + i + '")'
        }
      })
    }
  }
  /* execute nodes2 string */
  for (var key in nodes2) {
    var value = nodes2[key]
    for (var i = 1;; i++) {
      var re = eval('/(ui\\.' + key + '\\([^"\'$\\n]*)(["\'][^$\\n]+["\'])/i')
      if (!re.test(code))
        break
      code = code.replace(re, function($0, $1, $2) {
        re = /([^\\]|^)(["'].*?[^\\]["'])/ig
        if ($2.match(re).length > 1) {
          var j = 0
          var innerReplace = $2.replace(re, function($10, $11, $12) {
            j++
            str.push("    \"" + value + i + "_" + j + "\": " + $12)
            return $11 + '$l10n("' + value + i + "_" + j + '")'
          })
          return $1 + innerReplace
        } else {
          str.push("    \"" + value + i + "\": " + $2)
          return $1 + '$l10n("' + value + i + '")'
        }
      })
    }
  }
  var trans = str.join(",\n")
  var codeNew = '$' + "app.strings = {\n  \"en\": {\n" + trans + "\n  },\n  \"zh-Hans\": {\n" + trans + "\n  }\n}\n\n\n" + code
  modiView(codeNew, trans, code)
}

function relocalize(code, lines, trans, codeNew) {
  var str = []
  var patt = lines ? lines.split("\n") : []
  if (patt.length == 0)
    finalView(codeNew)
  else {
    var i = 1
    for (p of patt) {
      var match = code.indexOf(p)
      var string = /["'][^$\n]+["']/i.test(p)
      if (p == "" || match == -1 || !string)
        continue
      for (; match != -1; match = code.indexOf(p)) {
        code = code.replace(p, function($0) {
          var re = /["'][^$\n]+["']/i
          code = $0.replace(re, function($10) {
            re = /([^\\]|^)(["'].*?[^\\]["'])/ig
            if ($10.match(re).length > 1) {
              var j = 0
              var innerReplace = $10.replace(re, function($20, $21, $22) {
                j++
                str.push("    \"va" + i + "_" + j + "\": " + $22)
                return $21 + '$l10n("va' + i + "_" + j + '")'
              })
              return innerReplace
            } else {
              str.push("    \"va" + i + "\": " + $10)
              return '$l10n("va' + i + '")'
            }
          })
          return code
        })
      }
      i++
    }
    if (trans)
      str.unshift(trans)
    str = unique(str)
    var trans = str.join(",\n")
    var codeNew = '$' + "app.strings = {\n  \"en\": {\n" + trans + "\n  },\n  \"zh-Hans\": {\n" + trans + "\n  }\n}\n\n\n" + code
    finalView(codeNew)
  }
}

/* Main */
$app.autoKeyboardEnabled = true
preLine = ""
totalLines = ""
mainView()
