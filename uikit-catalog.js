// Prepare data
var data = [{
    name: "Activity Indicators",
    page: {
      views: [{
        type: "list",
        props: {
          data: [{
              title: "Default",
              rows: ["Gray Color"]
            },
            {
              title: "Tinted",
              rows: ["Red Color"]
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath) {
            sender.cell(indexPath).startLoading(indexPath.section > 0 ? {
              color: $color("#FF0000")
            } : {})
          }
        }
      }]
    }
  },
  {
    name: "Alert Controller",
    page: {
      views: [{
        type: "list",
        props: {
          data: [{
              title: "Alert",
              rows: ["Default"]
            },
            {
              title: "Action Sheet",
              rows: ["Default"]
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath) {
            var message = {
              title: "Title",
              message: "Message",
              actions: [{
                  title: "OK",
                  handler: function() {
                    $ui.toast("OK")
                  }
                },
                {
                  title: "Cancel",
                  style: "Cancel"
                }
              ]
            }
            if (indexPath.section == 0) {
              $ui.alert(message)
            } else {
              $ui.action(message)
            }
          }
        }
      }]
    }
  },
  {
    name: "Buttons",
    page: {
      views: [{
        type: "list",
        props: {
          data: [{
              title: "System (Text)",
              rows: [{
                type: "button",
                props: {
                  title: "Button"
                },
                layout: function(make, view) {
                  make.center.equalTo(view.super)
                  make.width.equalTo(64)
                },
                events: {
                  tapped: function(sender) {
                    $ui.toast("Tapped")
                  }
                }
              }]
            },
            {
              title: "System (Contact Add)",
              rows: [{
                type: "button",
                props: {
                  type: 5
                },
                layout: $layout.center
              }]
            },
            {
              title: "System (Detail Disclosure)",
              rows: [{
                type: "button",
                props: {
                  type: 2
                },
                layout: $layout.center
              }]
            },
            {
              title: "Image",
              rows: [{
                type: "button",
                props: {
                  src: "https://pic4.zhimg.com/9aa13b897_is.jpg"
                },
                layout: $layout.center
              }]
            }
          ]
        },
        layout: $layout.fill
      }]
    }
  },
  {
    name: "Date Picker",
    page: {
      views: [{
          type: "date-picker",
          layout: function(make) {
            make.left.top.right.equalTo(0)
          },
          events: {
            changed: function(sender) {
              $("date-label").text = sender.date
            }
          }
        },
        {
          type: "label",
          props: {
            id: "date-label",
            align: $align.center,
            text: new Date().toString()
          },
          layout: function(make, view) {
            make.centerX.equalTo(view.super)
            make.bottom.inset(10)
          }
        }
      ]
    }
  },
  {
    name: "Image View",
    page: {
      views: [{
        type: "image",
        props: {
          src: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
        },
        layout: function(make, view) {
          make.left.right.equalTo(0)
          make.centerY.equalTo(view.super)
          make.height.equalTo(320)
        }
      }]
    }
  },
  {
    name: "Video View",
    page: {
      views: [{
        type: "video",
        props: {
          src: "https://images.apple.com/media/cn/ipad-pro/2017/43c41767_0723_4506_889f_0180acc13482/films/feature/ipad-pro-feature-cn-20170605_1280x720h.mp4"
        },
        layout: function(make, view) {
          make.left.right.equalTo(0)
          make.centerY.equalTo(view.super)
          make.height.equalTo(256)
        }
      }]
    }
  },
  {
    name: "Page Control",
    page: {
      views: [{
        type: "gallery",
        props: {
          items: [{
              type: "image",
              props: {
                src: "https://images.apple.com/v/iphone/home/v/images/home/limited_edition/iphone_7_product_red_large_2x.jpg"
              }
            },
            {
              type: "image",
              props: {
                src: "https://images.apple.com/v/iphone/home/v/images/home/airpods_large_2x.jpg"
              }
            },
            {
              type: "image",
              props: {
                src: "https://images.apple.com/v/iphone/home/v/images/home/apple_pay_large_2x.jpg"
              }
            }
          ],
          interval: 3,
          radius: 5.0
        },
        layout: function(make, view) {
          make.left.right.inset(10)
          make.centerY.equalTo(view.super)
          make.height.equalTo(320)
        }
      }]
    }
  },
  {
    name: "Picker View",
    page: {
      views: [{
          type: "picker",
          props: {
            id: "picker",
            items: (function() {
              function fill() {
                var array = []
                for (var i=0; i<256; ++i) {
                  array.push(i)
                }
                return array
              }
              return [fill(), fill(), fill()]
            })()
          },
          layout: function(make) {
            make.left.top.right.equalTo(0)
          },
          events: {
            changed: function(sender) {
              var data = sender.data
              var color = $rgb(parseInt(data[0]), parseInt(data[1]), parseInt(data[2]))
              $("color-board").animator.makeBackground(color).easeIn.animate(0.5)
            }
          }
        },
        {
          type: "view",
          props: {
            id: "color-board",
            bgcolor: $rgb(0, 0, 0),
            radius: 5
          },
          layout: function(make) {
            make.top.equalTo($("picker").bottom)
            make.left.bottom.right.inset(10)
          }
        }
      ]
    }
  },
  {
    name: "Progress Views",
    page: {
      views: [{
        type: "list",
        props: {
          data: [{
              title: "Default",
              rows: [{
                type: "progress",
                props: {
                  value: 0.5
                },
                layout: function(make, view) {
                  make.centerY.equalTo(view.super)
                  make.left.right.inset(20)
                }
              }]
            },
            {
              title: "Tinted",
              rows: [{
                type: "progress",
                props: {
                  value: 0.6,
                  trackColor: $color("#00EEEE"),
                  progressColor: $color("#EE00EE")
                },
                layout: function(make, view) {
                  make.centerY.equalTo(view.super)
                  make.left.right.inset(20)
                }
              }]
            }
          ]
        },
        layout: $layout.fill
      }]
    }
  },
  {
    name: "Segmented Controls",
    page: {
      views: [{
        type: "list",
        props: {
          data: [{
              title: "Default",
              rows: [{
                type: "tab",
                props: {
                  items: ["Check", "Search", "Tools"]
                },
                layout: $layout.center,
                events: {
                  ready: function(sender) {
                    sender.disable(2)
                  }
                }
              }]
            },
            {
              title: "Tinted",
              rows: [{
                type: "tab",
                props: {
                  items: ["Check", "Search", "Tools"],
                  tintColor: $color("#00EEEE")
                },
                layout: $layout.center
              }]
            }
          ]
        },
        layout: $layout.fill
      }]
    }
  },
  {
    name: "Sliders",
    page: {
      views: [{
        type: "list",
        props: {
          data: [{
              title: "Default",
              rows: [{
                type: "slider",
                props: {
                  value: 0.5
                },
                layout: function(make, view) {
                  make.center.equalTo(view.super)
                  make.left.right.inset(10)
                }
              }]
            },
            {
              title: "Colored",
              rows: [{
                type: "slider",
                props: {
                  value: 0.5,
                  minColor: $color("#00EEEE"),
                  maxColor: $color("#EE00EE"),
                  thumbColor: $color("#EEEE00")
                },
                layout: function(make, view) {
                  make.center.equalTo(view.super)
                  make.left.right.inset(10)
                }
              }]
            }
          ]
        },
        layout: $layout.fill
      }]
    }
  },
  {
    name: "Stepper",
    page: {
      views: [{
          type: "stepper",
          props: {
            max: 10,
            min: 1,
            value: 5
          },
          layout: function(make, view) {
            make.centerX.equalTo(view.super)
            make.top.equalTo(24)
          },
          events: {
            changed: function(sender) {
              $("stepper-label").text = "" + sender.value
            }
          }
        },
        {
          type: "label",
          props: {
            id: "stepper-label",
            text: "5"
          },
          layout: function(make) {
            make.centerY.equalTo($("stepper"))
            make.right.inset(20)
          }
        }
      ]
    }
  },
  {
    name: "Switches",
    page: {
      views: [{
        type: "list",
        props: {
          data: [{
              title: "Default",
              rows: [{
                type: "switch",
                layout: $layout.center
              }]
            },
            {
              title: "Tinted",
              rows: [{
                type: "switch",
                props: {
                  on: true,
                  onColor: $color("#00EEEE"),
                  thumbColor: $color("#EE00EE")
                },
                layout: $layout.center
              }]
            }
          ]
        },
        layout: $layout.fill
      }]
    }
  },
  {
    name: "Text Fields",
    page: {
      views: [{
        type: "list",
        props: {
          data: [{
              title: "Default",
              rows: [{
                type: "input",
                props: {
                  type: $kbType.search,
                  darkKeyboard: true,
                },
                layout: function(make, view) {
                  make.center.equalTo(view.super)
                  make.height.equalTo(32)
                  make.left.right.inset(20)
                }
              }]
            },
            {
              title: "Secure",
              rows: [{
                type: "input",
                props: {
                  placeholder: "Placeholder text",
                  secure: true
                },
                layout: function(make, view) {
                  make.center.equalTo(view.super)
                  make.height.equalTo(32)
                  make.left.right.inset(20)
                }
              }]
            }
          ]
        },
        layout: $layout.fill
      }]
    }
  },
  {
    name: "Text View",
    page: {
      views: [{
        type: "text",
        props: {
          text: "Hello, World!\n\nThis is a demo for Text View in Pin extension!\n\nCurrently we don't support attributed string in iOS.\n\nYou can try html! Looks pretty cool."
        },
        layout: $layout.fill
      }]
    }
  },
  {
    name: "Web View",
    page: {
      views: [{
        type: "web",
        props: {
          url: "https://www.apple.com/cn"
        },
        layout: $layout.fill
      }]
    }
  },
  {
    name: "List View",
    page: {
      views: [{
        type: "list",
        props: {
          grouped: true,
          rowHeight: 64.0,
          footer: {
            type: "label",
            props: {
              height: 20,
              text: "Write the Code. Change the world.",
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },
          template: [{
              type: "label",
              props: {
                id: "title",
                font: $font(20)
              },
              layout: function(make) {
                make.left.equalTo(10)
                make.top.right.inset(8)
                make.height.equalTo(24)
              }
            },
            {
              type: "label",
              props: {
                id: "content",
                textColor: $color("#888888"),
                font: $font(15)
              },
              layout: function(make) {
                make.left.right.equalTo($("title"))
                make.top.equalTo($("title").bottom)
                make.bottom.equalTo(0)
              }
            }
          ],
          data: [{
              title: "Languages",
              rows: [{
                  title: {
                    text: "JavaScript"
                  },
                  content: {
                    text: "a high-level, dynamic, untyped, object-based, multi-paradigm, and interpreted programming language."
                  },
                  url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
                },
                {
                  title: {
                    text: "Swift"
                  },
                  content: {
                    text: "a general-purpose, multi-paradigm, compiled programming language developed by Apple Inc."
                  },
                  url: "https://swift.org"
                },
                {
                  title: {
                    text: "Objective-C"
                  },
                  content: {
                    text: "a general-purpose, object-oriented programming language that adds Smalltalk-style messaging to the C programming language."
                  },
                  url: "https://developer.apple.com/documentation/objectivec"
                }
              ]
            },
            {
              title: "Frameworks",
              rows: [{
                  title: {
                    text: "Vue"
                  },
                  content: {
                    text: "a progressive framework for building user interfaces."
                  },
                  url: "https://vuejs.org/"
                },
                {
                  title: {
                    text: "React"
                  },
                  content: {
                    text: "a JavaScript library for building user interfaces."
                  },
                  url: "https://facebook.github.io/react/"
                },
                {
                  title: {
                    text: "Angular"
                  },
                  content: {
                    text: "a development platform for building mobile and desktop web applications using Typescript/JavaScript (JS) and other languages."
                  },
                  url: "https://angularjs.org"
                }
              ]
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: function(tableView, indexPath) {
            $ui.push({
              views: [{
                type: "web",
                props: {
                  url: tableView.object(indexPath).url
                },
                layout: $layout.fill
              }]
            })
          }
        }
      }]
    }
  },
  {
    name: "Matrix View",
    page: {
      views: [{
          type: "matrix",
          props: {
            columns: 4,
            itemHeight: 88,
            spacing: 1,
            template: [{
              type: "label",
              props: {
                id: "tile",
                bgcolor: $color("#474b51"),
                textColor: $color("#abb2bf"),
                align: $align.center,
                font: $font(32)
              },
              layout: $layout.fill
            }],
            data: ["(", ")", "%", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", "C", ".", "="].map(function(item) {
              return {
                tile: {
                  text: "" + item
                }
              }
            })
          },
          layout: function(make) {
            make.left.bottom.right.equalTo(0)
            make.height.equalTo(446)
          },
          events: {
            didSelect: function(sender, indexPath, data) {
              var token = data.tile.text
              var label = $("input")
              if (token === "C") {
                label.text = ""
              } else if (token === "=") {
                label.text = eval(label.text)
              } else {
                label.text = label.text + token
              }
            }
          }
        },
        {
          type: "label",
          props: {
            id: "input",
            align: $align.right,
            font: $font("bold", 48)
          },
          layout: function(make) {
            make.left.right.inset(15)
            make.top.equalTo(0)
            make.bottom.equalTo($("matrix").top)
          }
        }
      ]
    }
  },
  {
    name: "Canvas",
    page: {
      views: [{
        type: "canvas",
        layout: $layout.fill,
        events: {
          draw: function(view, ctx) {
            var centerX = view.frame.width * 0.5
            var centerY = view.frame.height * 0.3
            var radius = 50.0
            ctx.fillColor = $color("#FF0000")
            ctx.moveToPoint(centerX, centerY - radius)
            for (var i = 1; i < 5; ++i) {
              var x = radius * Math.sin(i * Math.PI * 0.8)
              var y = radius * Math.cos(i * Math.PI * 0.8)
              ctx.addLineToPoint(x + centerX, centerY - y)
            }
            ctx.fillPath()
          }
        }
      }]
    }
  },
  {
    name: "Preview",
    page: {
      views: [{
        type: "list",
        props: {
          data: ["URL", "Text", "HTML"]
        },
        layout: $layout.fill,
        events: {
          didSelect: function(tableView, indexPath, title) {
            if (title === "URL") {
              $ui.preview({
                title: "URL",
                url: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
              })
            } else if (title === "Text") {
              $ui.preview({
                title: "Text",
                text: "Hello, World!"
              })
            } else if (title === "HTML") {
              $ui.preview({
                title: "HTML",
                html: "<p style='font-size: 40px;'>Hello, <b>World</b></p>"
              })
            }
          }
        }
      }]
    }
  }
]

data.forEach(function(item) {
  item.page.props = {
    title: item.name
  }
})

// Prepare view
$ui.render({
  props: {
    title: "UIKitCatalog"
  },
  views: [{
    type: "list",
    props: {
      id: "main-list"
    },
    layout: $layout.fill,
    events: {
      didSelect: function(tableView, indexPath) {
        $ui.push(data[indexPath.row].page)
      }
    }
  }]
})

// Render
$("main-list").data = data.map(function(item) {
  return item.name
})