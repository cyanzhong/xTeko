/*
 * by:Hhdº
 * 未经允许，禁止转载
 */

function inputpassword(number) {
  $ui.render({
    props: {
      title: (number == 0) ? "请输入密码" : "请输入新密码"
    },
    views: [{
        type: "matrix",
        props: {
          columns: 3,
          itemHeight: 88,
          spacing: 5,
          data: ["7", "8", "9", "4", "5", "6", "1", "2", "3", "⤶", "0", "完成"].map(function(item) {
            return {
              label: {
                text: item
              }
            }
          }),
          template: [{
            type: "label",
            props: {
              id: "label",
              bgcolor: $color("#474b51"),
              textColor: $color("#abb2bf"),
              align: $align.center,
              font: $font(35)
            },
            layout: $layout.fill
          }]
        },
        layout: function(make) {
          make.left.bottom.right.equalTo(0)
          make.height.equalTo(377)
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            if (indexPath.row == 11) {
              if (number == 0) {
                if ($("PasswordInput").text == password) {
                  zy()
                  load()
                } else {
                  $ui.toast("密码错误")
                }
              } else {
                $file.write({
                  data: $data({ string: $("PasswordInput").text }),
                  path: "mmgj.txt"
                })
                $ui.toast("密码设置成功！")
                zy()
                load()
              }
            } else if (indexPath.row == 9) {
              $("PasswordInput").text = $("PasswordInput").text.substring(0, $("PasswordInput").text.length - 1)
            } else {
              $("PasswordInput").text = $("PasswordInput").text + data.label.text
            }
          }
        }
      },
      {
        type: "label",
        props: {
          id: "PasswordInput",
          align: $align.center,
          font: $font(50)
        },
        layout: function(make) {
          make.bottom.equalTo($("matrix").top).offset(-20)
          make.right.left.inset(0)
        }
      }
    ]
  })
}

if ($file.exists("mmgj.txt") == true) {
  if ($cache.get("LoginSet") == "1") {
    zy()
    load()
  } else {
    var password = $file.read("mmgj.txt").string
    inputpassword(0)
  }
} else {
  inputpassword(1)
  $ui.toast("请设置脚本登录密码")
}

function zy() {
  $ui.render({
    props: {
      title: "密码管家"
    },
    views: [{
        type: "button",
        props: {
          id: "button",
          type: 5,
          title: " 添加网站"
        },
        layout: function(make) {
          make.top.right.inset(10)
        },
        events: {
          tapped: function(sender) {
            change(0, "", "")
          }
        }
      },
      {
        type: "button",
        props: {
          id: "button",
          type: 1,
          title: "设置",
          font: $font(17)
        },
        layout: function(make) {
          make.top.left.inset(10)
        },
        events: {
          tapped: function(sender) {
            setting()
          }
        }
      },
      {
        type: "list",
        props: {
          id: "list",
          template: [{
            type: "label",
            props: {
              id: "Label",
              font: $font("16")
            },
            layout: function(make, view) {
              make.left.inset(10)
              make.centerY.equalTo(view.super)
            }
          }],
          actions: [{
              title: "删除",
              handler: function(sender, indexPath) {
                $ui.menu({
                  items: ["删除"],
                  handler: function() {
                    $file.delete("密码管家/" + $("list").data[indexPath.row].Label.text + ".txt")
                    $("list").delete(indexPath)
                  }
                })
              }
            },
            {
              title: "打开网站",
              handler: function(sender, indexPath) {
                OpenURL($("list").data[indexPath.row].Data[0])
              }
            }
          ]
        },
        layout: function(make) {
          make.left.bottom.right.equalTo(0)
          make.top.equalTo($("button").bottom).offset(10)
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            change(1, data.Data, data.Label.text)
          }
        }
      }
    ]
  })
}

$file.mkdir("密码管家")

function load() {
  var files = $file.list("密码管家")
  var arr = []
  for (var i = 0; i < files.length; i++) {
    var name = files[i].replace(".txt", "")
    var data = $file.read("密码管家/" + files[i]).string.split(",")
    arr.push({
      Label: {
        text: name
      },
      Data: data
    })
  }
  $("list").data = arr
}

function setting() {
  $ui.push({
    props: {
      title: "设置"
    },
    views: [{
      type: "list",
      props: {
        id: "setlist",
        data: [{
            title: "密码设置",
            rows: [{
                Title: {
                  text: "更改密码"
                }
              },
              {
                type: "view",
                layout: $layout.fill,
                views: [{
                    type: "label",
                    props: {
                      id: "Title",
                      font: $font("16"),
                      text: "自动登录"
                    },
                    layout: function(make, view) {
                      make.left.inset(10)
                      make.centerY.equalTo(view.super)
                    }
                  },
                  {
                    type: "switch",
                    props: {
                      id: "LoginSwitch",
                      on: ($cache.get("LoginSet") == "1") ? true : false
                    },
                    layout: function(make, view) {
                      make.centerY.equalTo(view.super)
                      make.right.inset(10)
                    },
                    events: {
                      changed: function(sender) {
                        $cache.set("LoginSet", ($("LoginSwitch").on == true) ? "1" : "0")
                      }
                    }
                  }
                ]
              }
            ]
          },
          {
            title: "其他",
            rows: [{
                Title: {
                  text: "忘记密码"
                }
              },
              {
                Title: {
                  text: "清除所有网站",
                  textColor: $color("red")
                }
              }
            ]
          }
        ],
        template: [{
          type: "label",
          props: {
            id: "Title",
            font: $font("16")
          },
          layout: function(make, view) {
            make.left.inset(10)
            make.centerY.equalTo(view.super)
          }
        }],
        footer: {
          type: "label",
          props: {
            height: 20,
            text: "By: Hhdº",
            textColor: $color("#AAAAAA"),
            align: $align.center,
            font: $font(12)
          }
        }
      },
      layout: $layout.fill,
      events: {
        didSelect: function(sender, indexPath, data) {
          var title = data.Title.text
          if (title == "更改密码") {
            inputpassword(1)
          } else if (title == "清除所有网站") {
            $ui.alert({
              title: "提示",
              message: "此操作将清空所有已保存的网站(此操作不能逆)，是否继续？",
              actions: [{
                  title: "继续",
                  handler: function() {
                    var files = $file.list("密码管家")
                    for (var i = 0; i < files.length; i++) {
                      $file.delete("密码管家/" + files[i])
                    }
                    $ui.alert("已清除！")
                    $app.close()
                  }
                },
                {
                  title: "取消"
                }
              ]
            })
          } else if (title == "忘记密码") {
            OpenURL("http://note.youdao.com/noteshare?id=d8c33ef54d08041fc7250d661f17a5b5")
          }
        }
      }
    }]
  })
}

function change(number, data, website) {
  $ui.push({
    views: [{
        type: "input",
        props: {
          id: "Website",
          text: website,
          placeholder: "网站名称",
        },
        layout: function(make) {
          make.top.left.right.inset(10)
          make.height.equalTo(40)
        }
      },
      {
        type: "input",
        props: {
          id: "URL",
          text: data[0],
          placeholder: "网站链接",
        },
        layout: function(make) {
          make.left.right.inset(10)
          make.top.equalTo($("Website").bottom).offset(20)
          make.height.equalTo(40)
        }
      },
      {
        type: "input",
        props: {
          id: "UserName",
          text: data[1],
          placeholder: "用户名/邮箱/手机号",
        },
        layout: function(make) {
          make.left.right.inset(10)
          make.top.equalTo($("URL").bottom).offset(20)
          make.height.equalTo(40)
        }
      },
      {
        type: "input",
        props: {
          id: "Password",
          placeholder: "密码",
          text: data[2]
        },
        layout: function(make) {
          make.left.right.inset(10)
          make.top.equalTo($("UserName").bottom).offset(20)
          make.height.equalTo(40)
        }
      },
      {
        type: "text",
        props: {
          id: "Notes",
          text: (number == 0) ? "备注……" : data[3],
          bgcolor: $color("#EDEDED"),
          textColor: $color("#AAAAAA"),
          radius: 7,
        },
        layout: function(make) {
          make.left.right.inset(10)
          make.top.equalTo($("Password").bottom).offset(20)
          make.height.equalTo(100)
        }
      },
      {
        type: "button",
        props: {
          id: "OK",
          title: "完成",
        },
        layout: function(make) {
          make.bottom.right.left.inset(10)
        },
        events: {
          tapped: function(sender) {
            $file.write({
              data: $data({ string: $("URL").text + "," + $("UserName").text + "," + $("Password").text + "," + $("Notes").text }),
              path: "密码管家/" + $("Website").text + ".txt"
            })
            load()
            $ui.pop()
          }
        }
      }
    ]
  })
}

function OpenURL(url) {
  $ui.push({
    props: {
      title: url
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