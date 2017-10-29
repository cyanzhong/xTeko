$app.strings = {
  "en": {
    "title": "TestFlight Beta Apply",
    "loading": "Loading…",
    "set": "Setting",
    "share": "Share",
    "copyLink": "Copy Link",
    "copied": "Copied:",
    "settingTip": "There is nothing.",
    "Help": "Help",
    "EmailMessage": "Copied the email to the clipboard\n\nPlease send an email to the developer to apply beta\n\nNote:And the developer explains the software to be applied and the reason for your application",
    "Way1": "Open the e-mail",
    "Way2": "Copy e-mail address",
    "Way3": "Cancel",
    "SearchMessage": "Search…",
    "Error": "Error",
    "Wwl": "There is currently no network connection.",
    "update": " update",
    "searchmessage": "search results",
    "nc": " Beta",
    "Qq": "QQ Mail",
    "Xtzd": "Email",
    "Wy": "NetEase Mail",
    "Tfsyff": "TestFlight Use help",
    "JSsyff": "JS Use help",
    "Gy": "About",
    "Cs": "Case Sensitive",
    "About": "Author: Hhdº\n\nProduct with: L.",
    "Cfu": "Check for updates",
    "Ty": "General",
    "Qt": "Others",
    "Yy": "Scripting Language",
    "yyts": "Please change the language in settings of Pin",
    "Sssz": "Search settings",
    "Jqqd": "To be continued",
  },
  "zh-Hans": {
    "title": "TestFlight内测申请",
    "loading": "加载中……",
    "set": "设置",
    "share": "分享",
    "copyLink": "复制链接",
    "copied": "已复制：",
    "settingTip": "空空如也",
    "Help": "帮助",
    "EmailMessage": "已复制该邮箱到剪切板\n\n请给开发者发邮件来申请TF内测\n\n注：要和开发者说明要申请的软件和你申请的理由",
    "Way1": "跳转至邮箱",
    "Way2": "复制邮箱",
    "Way3": "取消",
    "SearchMessage": "搜索……",
    "Error": "错误",
    "Wwl": "无网络连接",
    "update": " 更新",
    "searchmessage": "个搜索结果",
    "nc": "内测",
    "Qq": "QQ邮箱",
    "Xtzd": "系统自带邮箱",
    "Wy": "网易邮箱",
    "Tfsyff": "TestFlight使用方法",
    "JSsyff": "脚本使用方法",
    "Gy": "关于我们",
    "Cs": "区分大小写",
    "About": "作者：Hhdº\n\n联合制作：L.",
    "Cfu": "检查更新",
    "Qt": "其他",
    "Ty": "通用",
    "Yy": "脚本语言",
    "yyts": "请在PIN设置内更改语言",
    "Sssz": "搜索设置",
    "Jqqd": "敬请期待"
  },
  "zh-Hant": {
    "title": "TestFlight內測申請",
    "loading": "加載中……",
    "set": "設置",
    "share": "分享",
    "copyLink": "複製鏈接",
    "copied": "已復製：",
    "settingTip": "空空如也",
    "Help": "幫助",
    "EmailMessage": "已複制該郵箱到剪切板\n\n請給開發者發郵件來申請TF內測\n\n注：要和開發者說明要申請的軟件和你申請的理由",
    "Way1": "跳轉至郵箱",
    "Way2": "複製郵箱",
    "Way3": "取消",
    "SearchMessage": "搜索……",
    "Error": "錯誤",
    "Wwl": "無網絡連接",
    "update": " 更新",
    "searchmessage": "個搜索結果",
    "nc": "內測",
    "Qq": "QQ郵箱",
    "Xtzd": "系統自帶郵箱",
    "Wy": "網易郵箱",
    "Tfsyff": "TestFlight使用方法",
    "JSsyff": "腳本使用方法",
    "Gy": "關於我們",
    "Cs": "區分大小寫",
    "About": "作者：Hhdº\n\n聯合製作：L.",
    "Cfu": "檢查更新",
    "Qt": "其他",
    "Ty": "通用",
    "Yy": "腳本語言",
    "yyts": "請在PIN設置內更改語言",
    "Sssz": "搜索設置",
    "Jqqd": "敬請期待"
  }
}

var apps = [
  { name: $l10n("Xtzd"), url: "mailto://Item from List" },
  { name: $l10n("Qq"), url: "qqmail://" },
  { name: $l10n("Wy"), url: "mailmaster://" },
  { name: "Gmail", url: "googlegmail:///co?to=Item from List" },
  { name: "Outlook", url: "ms-outlook://" },
  { name: "Airmail", url: "airmail://" }
]

$ui.render({
  props: {
    title: $l10n("title")
  },
  views: [{
      type: "label",
      props: {
        id: "tip",
        font: $font("bold", 20),
        text: $l10n("loading"),
        align: $align.center
      },
      layout: function(make, view) {
        make.top.left.inset(10)
      }
    },
    {
      type: "button",
      props: {
        id: "Setting",
        type: 1,
        font: $font(17),
        title: $l10n("set")
      },
      layout: function(make, view) {
        make.top.inset(7)
        make.right.inset(20)
      },
      events: {
        tapped: function(sender) {
          Setting()
        }
      }
    },
    {
      type: "button",
      props: {
        id: "help",
        type: 1,
        font: $font(17),
        title: $l10n("Help")
      },
      layout: function(make, view) {
        make.top.equalTo($("Setting").top)
        make.right.equalTo($("Setting").left).offset(-20)
      },
      events: {
        tapped: function(sender) {
          $ui.menu({
            items: [$l10n("JSsyff"), $l10n("Tfsyff")],
            handler: function(title, idx) {
              if (idx == 0) {
                openurl("http://note.youdao.com/noteshare?id=aa4418b8e41f3d9c623381badb73e620", $l10n("JSsyff"))
              } else {
                openurl("http://mp.weixin.qq.com/s/gt2n4vdmWN01FBRJp6o53A", $l10n("Tfsyff"))
              }
            }
          })
        }
      }
    },
    {
      type: "list",
      props: {
        id: "list",
        rowHeight: 50.0,
        actions: [{
            title: $l10n("share"),
            handler: function(sender, indexPath) {
              var title = $("list").data[indexPath.row]
              var url = $cache.get(title).replace(" ", "")
              $share.sheet(url)
            }
          },
          {
            title: $l10n("copyLink"),
            handler: function(sender, indexPath) {
              var title = $("list").data[indexPath.row]
              var url = $cache.get(title).replace(" ", "")
              $clipboard.text = url
              $ui.toast($l10n("copied") + url)
            }
          }
        ]
      },
      layout: function(make, view) {
        make.top.equalTo($("tip").bottom).offset(60)
        make.right.left.bottom.inset(0)
      },
      events: {
        didSelect: function(sender, indexPath, data) {
          var url = $cache.get(data).replace(/\s|;/g, "")
          var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
          var check = reg.test(url)
          if (check == 0) {
            openurl(url, data)
          } else {
            $clipboard.text = url
            $ui.alert({
              title: url,
              message: $l10n("EmailMessage"),
              actions: [{
                  title: $l10n("Way1"),
                  handler: function() {
                    $ui.menu({
                      items: apps.map(function(item) { return item.name }),
                      handler: function(title, idx) {
                        var url = apps[idx].url.replace("Item from List", $clipboard.text)
                        $app.openURL(url)
                      }
                    })
                  }
                },
                {
                  title: $l10n("Way3")
                }
              ]
            })
          }
        },
        pulled: function(sender) {
          $("Search").text = ""
          al()
        }
      }
    },
    {
      type: "list",
      props: {
        id: "List",
        data: [{
          rows: [{
            type: "input",
            props: {
              id: "Search",
              type: $kbType.search,
              darkKeyboard: true,
              align: $align.center,
              placeholder: $l10n("SearchMessage")
            },
            layout: function(make, view) {
              make.left.right.top.bottom.inset(5)
            },
            events: {
              returned: function(sender) {
                search($("Search").text, "0")

              }
            }
          }]
        }]
      },
      layout: function(make, view) {
        make.top.equalTo($("tip").bottom).offset(10)
        make.bottom.equalTo($("list").top).offset(-10)
        make.right.left.inset(0)
      }
    },
  ]
})

function al() {
  if (typeof($cache.get("data")) == "undefined") {
    $ui.loading(true)
  }
  $http.get({
    url: "https://coding.net/u/L928737095/p/L928737095.Coding.me/git/raw/master/TF%25E5%2586%2585%25E5%25AE%25B9",
    handler: function(resp) {
      var tfs = resp.data.split("\n")
      $("list").data = [""]
      for (var i = 1; i < tfs.length; i++) {
        var json = tfs[i].split(": ")
        var title = json[0].replace(/内测/g, $l10n("nc"))
        if (i == tfs.length - 1) {} else {
          if (i == 1) {
            $("list").data = [title]
          } else {
            $("list").insert({
              index: 0,
              value: title,
            })
          }
        }
        $cache.set(title, json[1])
      }
      $ui.loading(false)
      var umessage = tfs[0].split(": http")[0].match(/\d+年\d+月\d+日\s\d+:\d+/)[0].replace(/年|月|日/g, "/")
      $("tip").text = umessage
      $("list").endRefreshing()
      $cache.set("data", $("list").data)
      $("list").data = $("list").data.reverse()
    }
  })
}

function openurl(url, title) {
  $ui.push({
    props: {
      title: title
    },
    views: [{
      type: "web",
      props: {
        url: url
      },
      layout: $layout.fill
    }]
  })
}

function Setting() {
  $ui.push({
    props: {
      title: $l10n("set")
    },
    views: [{
      type: "list",
      props: {
        id: "list1",
        data: [{
            title: $l10n("Ty"),
            rows: [$l10n("Sssz"), $l10n("Yy")]
          },
          {
            title: $l10n("Qt"),
            rows: [$l10n("Gy"), $l10n("Cfu")]
          }
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect: function(sender, indexPath, title) {
          if (title == $l10n("Sssz")) {
            SearchSetting()
          } else if (title == $l10n("Yy")) {
            $ui.alert($l10n("yyts"))
          } else if (title == $l10n("Gy")) {
            About()
          } else if (title == $l10n("Cfu")) {
            $ui.alert($l10n("Jqqd"))
          } else if (title.indexOf("公告") == 0) {
            $ui.alert($cache.get("board"))
          }
        }
      }
    }]
  })
  if (typeof($cache.get("board")) == "undefined") {
    $ui.loading(true)
    $http.get({
      url: "https://coding.net/u/Hhhd/p/Hhhd1507206502721.Coding.me/git/raw/master/TestFlight%25E5%2586%2585%25E6%25B5%258B%25E7%2594%25B3%25E8%25AF%25B7%25E5%2585%25AC%25E5%2591%258A",
      handler: function(resp) {
        $ui.loading(false)
        $cache.set("board", resp.data)
        if (resp.data == "无公告") {} else {
          $("list1").insert({
            indexPath: $indexPath(1, 2),
            value: resp.data
          })
        }
      }
    })
  } {
    if ($cache.get("board") == "无公告") {} else {
      $("list1").insert({
        indexPath: $indexPath(1, 2),
        value: $cache.get("board")
      })
    }
  }
}

function search(keywords, times) {
  var data = $cache.get("data")
  $("list").data = [""]
  for (var i = 1; i < data.length; i++) {
    var name = data[i]
    var bd = $cache.get("CS")
    var reg = (bd == "False") ? eval("/" + keywords + "/i") : eval("/" + keywords + "/")
    var check = reg.test(name)
    if (check == false) {} else {
      if (times == "0") {
        $("list").data = [name]
        var times = "1"
      } else {
        $("list").insert({
          index: 0,
          value: name
        })
        var times = "1"
      }
    }
  }
  $("tip").text = (times == 0) ? "0 " + $l10n("searchmessage") : $("list").data.length + " " + $l10n("searchmessage")
}

if ($device.networkType == 0) {
  $ui.alert({
    title: $l10n("Error"),
    message: $l10n("Wwl")
  })
  $("tip").text = $l10n("Error")
}

function About() {
  $ui.push({
    props: {
      title: $l10n("Gy")
    },
    views: [{
      type: "label",
      props: {
        text: $l10n("About"),
        lines: 0,
        align: $align.center,
        font: $font("bold", 20),
      },
      layout: $layout.fill
    }]
  })
}

function SearchSetting() {
  $ui.push({
    props: {
      title: $l10n("Sssz")
    },
    views: [{
      type: "list",
      props: {
        id: "searchs",
        selectable: false,
        data: [{
          Items: {
            text: $l10n("Cs")
          }
        }],
        template: [{
            type: "label",
            props: {
              id: "Items",
              font: $font("bold", 17),
              align: $align.center
            },
            layout: function(make, view) {
              make.top.inset(15)
              make.left.inset(10)
            }
          },
          {
            type: "switch",
            layout: function(make, view) {
              make.right.inset(10)
              make.top.inset(8)
            },
            events: {
              changed: function(sender) {
                $cache.set("CS", ($("switch").on == true) ? "True" : "False")

              }
            }
          }
        ]
      },
      layout: $layout.fill,
    }, ]
  })
  $("switch").on = ($cache.get("CS") == "True") ? true : false
}

$app.keyboardToolbarEnabled = true

$app.open()

$cache.clear()

al()

$cache.set("CS", "False")