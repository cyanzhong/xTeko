const ON_SCREEN = 0,
  COMING_SOON = 1,
  LOCAL = "",
  ICLOUD = "drive://"

const DEFAULT = [
  ["medium", 0, 8, false],
  [true, LOCAL]
]

const MENU = {
  COVER_IMAGE_QUALITY: [{
      "name": "Small",
      "value": "small"
    },
    {
      "name": "Medium",
      "value": "medium"
    },
    {
      "name": "Large",
      "value": "large"
    }
  ],
  RECENT_MAIN_INDEX: [{
      "name": "On Screen",
      "value": 0
    },
    {
      "name": "Coming Soon",
      "value": 1
    }
  ],
  SAVING_PATH: [{
      "name": "Local",
      "value": ""
    },
    {
      "name": "iCloud",
      "value": "drive://"
    }
  ]
}

// Template Object
const template = [{
    type: "image",
    props: {
      id: "cover",
      radius: 5
    },
    layout: function(make) {
      make.width.equalTo(75)
      make.top.bottom.inset(5)
      make.left.inset(15)
    }
  },
  {
    type: "label",
    props: {
      id: "title",
      font: $font("bold", 18),
      autoFontSize: true
    },
    layout: function(make) {
      var preView = $("cover")
      make.left.equalTo(preView.right).offset(10)
      make.height.equalTo(18)
      make.top.inset(10)
      make.right.inset(5)
    }
  },
  {
    type: "label",
    props: {
      id: "original",
      font: $font("bold", 12),
      autoFontSize: true
    },
    layout: function(make) {
      var preView = $("title")
      make.top.equalTo(preView.bottom)
      make.left.equalTo(preView.left)
      make.right.inset(5)
    }
  },
  {
    type: "label",
    props: {
      id: "genres",
      font: $font(12),
      bgcolor: $color("#F5F5F5"),
      textColor: $color("#666666"),
      radius: 2
    },
    layout: function(make) {
      var preView = $("original")
      make.top.equalTo(preView.bottom).offset(5)
      make.height.equalTo(20)
      make.left.equalTo(preView.left)
    }
  },
  {
    type: "label",
    props: {
      id: "director",
      font: $font(12),
      textColor: $color("#666666")
    },
    layout: function(make) {
      var preView = $("genres")
      make.top.equalTo(preView.bottom).offset(5)
      make.left.equalTo(preView.left)
      make.right.inset(5)
    }
  },
  {
    type: "label",
    props: {
      id: "cast",
      font: $font(12),
      textColor: $color("#666666")
    },
    layout: function(make) {
      var preView = $("director")
      make.top.equalTo(preView.bottom).offset(5)
      make.left.equalTo(preView.left)
      make.right.inset(5)
    }
  }
]

// Read Setting
var SETTING
// Try Local
var file = $file.read("Setting.conf")
if (typeof(file) == "undefined") {
  // Try iCloud
  file = $file.read("drive://Setting.conf")
  if (typeof(file) == "undefined") {
    SETTING = 0
  } else {
    SETTING = 1
  }
} else {
  SETTING = 1
}
var SETTING_FILE = SETTING ? JSON.parse(file.string) : JSON.parse(JSON.stringify(DEFAULT))

// Read Favorite
var FAVORITE
// Try Local
var file = $file.read("Favorite.conf")
if (typeof(file) == "undefined") {
  // Try iCloud
  file = $file.read("drive://Favorite.conf")
  if (typeof(file) == "undefined") {
    FAVORITE = 0
  } else {
    FAVORITE = 1
  }
} else {
  FAVORITE = 1
}
var FAVORITE_FILE = FAVORITE ? JSON.parse(file.string) : [{ title: "Favorite", rows: [] }, { title: "Checked", rows: [] }]

Array.prototype.move = function(from, to) {
  var fromSec = from.section,
    fromRow = from.row,
    toSec = to.section,
    toRow = to.row
  var cellData = this[fromSec].rows[fromRow]
  this[fromSec].rows.splice(fromRow, 1)
  this[toSec].rows.splice(toRow, 0, cellData)
}

/* Function */
function generateMainViewObjects() {
  recent = {
    type: "list",
    props: {
      id: "recent",
      info: "recent",
      hidden: false,
      rowHeight: 115,
      stickyHeader: true,
      bgcolor: $color("#F9F9F9"),
      data: [{
        title: "",
        rows: []
      }],
      template: template,
      header: {
        type: "view",
        props: {
          height: 50,
          bgcolor: $color("white")
        },
        views: [{
            type: "tab",
            props: {
              id: "segment",
              index: SETTING_FILE[0][1],
              items: ["On Screen", "Coming Soon"],
              tintColor: $color("#666666")
            },
            layout: function(make) {
              make.top.right.inset(10)
            },
            events: {
              changed: function(sender) {
                $("recent").endFetchingMore()

                var idx = sender.index
                if (SETTING_FILE[0][3]) {
                  fetchCache(idx)
                } else {
                  fetchRecent(idx)
                }
              }
            }
          },
          {
            type: "input",
            props: {
              id: "search",
              placeholder: "Search ...",
              textColor: $color("#666666")
            },
            layout: function(make) {
              var preView = $("segment")
              make.right.equalTo(preView.left).offset(-10)
              make.height.equalTo(30)
              make.left.top.inset(10)
            },
            events: {
              returned: function(sender) {
                sender.blur()
                if (sender.text != "") {
                  $("recent").endFetchingMore()

                  $("segment").index = -1
                  fetchQuery(sender.text)
                }
              }
            }
          }
        ]
      },
      footer: {
        type: "view",
        props: {
          height: 60
        },
        views: [{
          type: "label",
          props: {
            id: "page",
            font: $font(12),
            align: $align.center,
            textColor: $color("#AAAAAA")
          },
          layout: function(make, view) {
            make.height.equalTo(20)
            make.centerX.equalTo(view.super)
            make.top.inset(10)
          }
        }]
      },
      actions: [{
          title: " ♥ ",
          handler: function(sender, indexPath) {
            var data = sender.object(indexPath)
            favoriteItem(data)
          }
        },
        {
          title: " ↻ ",
          handler: function(sender, indexPath) {
            var id = sender.object(indexPath).id
            $safari.open({
              url: "https://movie.douban.com/subject/" + id
            })
          }
        }
      ]
    },
    layout: $layout.fill,
    events: {
      didSelect: function(sender, indexPath, data) {
        $ui.loading(true)
        var title = data.title.text
        var url = "https://api.douban.com/v2/movie/subject/" + data.id
        $http.get({
          url: url,
          handler: function(resp) {
            $ui.loading(false)
            detailView(title, resp.data)
          }
        })
      },
      pulled: function(sender) {
        var type = $("segment").index
        if (type == -1) {
          var keyword = $("search").text
          fetchQuery(keyword, true)
        } else {
          fetchRecent(type, true)
        }
      },
      didReachBottom: function(sneder) {
        $device.taptic(1)
        var type = $("segment").index
        var start = $("recent").data[0].rows.length
        if (type == -1) {
          var keyword = $("search").text
          fetchQuery(keyword, false, start)
        } else {
          fetchRecent(type, false, start)
        }
      }
    }
  }

  // Favorite View Object
  favorite = {
    type: "list",
    props: {
      id: "favorite",
      info: "favorite",
      hidden: true,
      rowHeight: 115,
      reorder: true,
      stickyHeader: true,
      data: SETTING_FILE[1][0] ? FAVORITE_FILE : [FAVORITE_FILE[0]],
      template: template,
      footer: {
        props: {
          height: 0.1
        }
      },
      actions: [{
          title: "delete",
          handler: function(sender, indexPath) {
            favoriteItemDelete(indexPath)
          }
        },
        {
          title: " ↻ ",
          handler: function(sender, indexPath) {
            var id = sender.object(indexPath).id
            $safari.open({
              url: "https://movie.douban.com/subject/" + id
            })
          }
        },
        {
          title: "●○",
          handler: function(sender, indexPath) {
            var data = sender.object(indexPath)
            favoriteCheckUncheck(data, indexPath)
          }
        }
      ]
    },
    layout: $layout.fill,
    events: {
      didSelect: function(sender, indexPath, data) {
        $ui.loading(true)
        var title = data.title.text
        var url = "https://api.douban.com/v2/movie/subject/" + data.id
        $http.get({
          url: url,
          handler: function(resp) {
            $ui.loading(false)
            detailView(title, resp.data)
          }
        })
      },
      reorderMoved: function(from, to) {
        FAVORITE_FILE.move(from, to)
      },
      reorderFinished: function() {
        saveFavorite(FAVORITE_FILE)
      }
    }
  }

  // Setting View Object
  setting = {
    type: "list",
    props: {
      id: "setting",
      info: "setting",
      hidden: true,
      data: [{
          title: "General",
          rows: [{
              setup: {
                text: "Cover Image Quality"
              },
              value: {
                text: MENU.COVER_IMAGE_QUALITY.filter(function(x) {
                  return SETTING_FILE[0][0] == x.value
                })[0].name
              }
            },
            {
              setup: {
                text: "Recent Main Index"
              },
              value: {
                text: MENU.RECENT_MAIN_INDEX.filter(function(x) {
                  return SETTING_FILE[0][1] == x.value
                })[0].name
              }
            },
            {
              type: "views",
              layout: $layout.fill,
              views: [{
                  type: "label",
                  props: {
                    text: "Image Per Page",
                    textColor: $color("#666666")
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.left.inset(15)
                  }
                },
                {
                  type: "stepper",
                  props: {
                    min: 5,
                    value: SETTING_FILE[0][2],
                    tintColor: $color("#666666")
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.right.inset(10)
                  },
                  events: {
                    changed: function(sender) {
                      sender.next.text = sender.value
                      saveSetting(0, 2, sender.value)
                    }
                  }
                },
                {
                  type: "label",
                  props: {
                    text: SETTING_FILE[0][2].toString(),
                    color: $color("#666666")
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.right.equalTo(view.prev.left).offset(-10)
                  }
                }
              ]
            },
            {
              type: "views",
              layout: $layout.fill,
              views: [{
                  type: "label",
                  props: {
                    text: "Cache Query Results",
                    textColor: $color("#666666")
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.left.inset(15)
                  }
                },
                {
                  type: "switch",
                  props: {
                    on: SETTING_FILE[0][3],
                    onColor: $color("#666666")
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.right.inset(10)
                  },
                  events: {
                    changed: function(sender) {
                      $cache.clear()
                      saveSetting(0, 3, sender.on)
                    }
                  }
                }
              ]
            },
            {
              setup: {
                text: "Clear Cache"
              }
            },
            {
              setup: {
                text: "Reset"
              }
            }
          ]
        },
        {
          title: "Favorite",
          rows: [{
              type: "view",
              layout: $layout.fill,
              views: [{
                  type: "label",
                  props: {
                    text: "Show Checked Results",
                    textColor: $color("#666666")
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.left.inset(15)
                  }
                },
                {
                  type: "switch",
                  props: {
                    on: SETTING_FILE[1][0],
                    onColor: $color("#666666")
                  },
                  layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.right.inset(10)
                  },
                  events: {
                    changed: function(sender) {
                      toggleFavorited(sender.on)
                      saveSetting(1, 0, sender.on)
                    }
                  }
                }
              ]
            },
            {
              setup: {
                text: "Saving Path"
              },
              value: {
                text: MENU.SAVING_PATH.filter(function(x) {
                  return SETTING_FILE[1][1] == x.value
                })[0].name
              }
            }
          ]
        }
      ],
      template: [{
          type: "label",
          props: {
            id: "setup",
            textColor: $color("#666666")
          },
          layout: function(make, view) {
            make.centerY.equalTo(view.super)
            make.left.inset(15)
          }
        },
        {
          type: "label",
          props: {
            id: "value",
            textColor: $color("#666666")
          },
          layout: function(make, view) {
            make.centerY.equalTo(view.super)
            make.right.inset(10)
          }
        }
      ],
      footer: {
        type: "label",
        props: {
          text: "Created by RYAN.\n\nSource from ©douban.com",
          lines: 0,
          font: $font(12),
          textColor: $color("#AAAAAA"),
          align: $align.center
        }
      }
    },
    layout: $layout.fill,
    events: {
      didSelect: function(view, indexPath) {
        activeSettingMenu(indexPath)
      }
    }
  }
}

function mainView() {
  var perWidth = $device.info.screen.width / 3
  $ui.render({
    props: {
      title: "Movie List",
    },
    views: [{
        type: "view",
        props: {
          id: "menu",
          //bgcolor: $rgb(247, 247, 247),
        },
        layout: function(make) {
          make.height.equalTo(50)
          make.left.bottom.right.inset(0)
        },
        views: [{
            type: "button",
            props: {
              bgcolor: $color("clear")
            },
            layout: function(make, view) {
              make.width.equalTo(perWidth)
              make.left.top.bottom.inset(0)
            },
            views: [{
                // Left Button
                type: "image",
                props: {
                  id: "recent_button",
                  icon: $icon("067", $color("clear"), $size(72, 72)),
                  bgcolor: $color("clear"),
                  tintColor: $color("darkGray")
                },
                layout: function(make, view) {
                  make.centerX.equalTo(view.super)
                  make.width.height.equalTo(25)
                  make.top.inset(7)
                },
              },
              {
                type: "label",
                props: {
                  id: "recent_label",
                  text: "Recent",
                  font: $font(10),
                  textColor: $color("darkGray")
                },
                layout: function(make, view) {
                  var preView = view.prev
                  make.centerX.equalTo(preView)
                  make.top.equalTo(preView.bottom).offset(1)
                }
              }
            ],
            events: {
              tapped: function(sender) {
                activeMenu("recent")
              }
            }
          },
          {
            type: "button",
            props: {
              bgcolor: $color("clear")
            },
            layout: function(make, view) {
              var preView = view.prev
              make.left.equalTo(preView.right)
              make.width.equalTo(perWidth)
              make.top.bottom.inset(0)
            },
            views: [{
                // Center Button
                type: "image",
                props: {
                  id: "favorite_button",
                  icon: $icon("061", $color("clear"), $size(72, 72)),
                  bgcolor: $color("clear"),
                  tintColor: $color("lightGray")
                },
                layout: function(make, view) {
                  make.centerX.equalTo(view.super)
                  make.width.height.equalTo(25)
                  make.top.inset(7)
                }
              },
              {
                type: "label",
                props: {
                  id: "favorite_label",
                  text: "Favorite",
                  font: $font(10),
                  textColor: $color("darkGray")
                },
                layout: function(make, view) {
                  var preView = view.prev
                  make.centerX.equalTo(preView)
                  make.top.equalTo(preView.bottom).offset(1)
                }
              }
            ],
            events: {
              tapped: function(sender) {
                activeMenu("favorite")
              }
            }
          },
          {
            type: "button",
            props: {
              bgcolor: $color("clear")
            },
            layout: function(make, view) {
              make.width.equalTo(perWidth)
              make.top.right.bottom.inset(0)
            },
            views: [{
                // Right Button
                type: "image",
                props: {
                  id: "setting_button",
                  icon: $icon("002", $color("clear"), $size(72, 72)),
                  bgcolor: $color("clear"),
                  tintColor: $color("lightGray")
                },
                layout: function(make, view) {
                  make.centerX.equalTo(view.super)
                  make.width.height.equalTo(25)
                  make.top.inset(7)
                }
              },
              {
                type: "label",
                props: {
                  id: "setting_label",
                  text: "Settings",
                  font: $font(10),
                  textColor: $color("darkGray")
                },
                layout: function(make, view) {
                  var preView = view.prev
                  make.centerX.equalTo(preView)
                  make.top.equalTo(preView.bottom).offset(1)
                }
              }
            ],
            events: {
              tapped: function(sender) {
                activeMenu("setting")
                if (SETTING == 0) {
                  // Notify file missing
                  $device.taptic(1)
                  saveSettingAsDefault()
                }
              }
            }
          },
          {
            type: "canvas",
            layout: function(make) {
              make.height.equalTo(1)
              make.left.top.right.inset(0)
            },
            events: {
              draw: function(view, ctx) {
                var width = view.frame.width
                ctx.strokeColor = $rgb(211, 211, 211)
                ctx.setLineWidth(1)
                ctx.moveToPoint(0, 0)
                ctx.addLineToPoint(width, 0)
                ctx.strokePath()
              }
            }
          }
        ]
      },
      {
        type: "view",
        props: {
          id: "content"
        },
        layout: function(make) {
          var preView = $("menu")
          make.bottom.equalTo(preView.top)
          make.left.top.right.inset(0)
        },
        views: [recent, favorite, setting]
      }
    ]
  })
}

function detailView(title, data) {
  $ui.push({
    props: {
      title: title
    },
    views: [{
      type: "list",
      props: {
        id: "detail",
        data: [{
            title: "Basic Info",
            rows: [{
              type: "view",
              layout: $layout.fill,
              views: [{
                  // Title
                  type: "label",
                  props: {
                    font: $font("bold", 18),
                    text: data.title
                  },
                  layout: function(make) {
                    make.height.equalTo(18)
                    make.top.left.inset(10)
                  }
                },
                {
                  // Original Title
                  type: "label",
                  props: {
                    font: $font("bold", 13),
                    text: data.original_title == data.title ? "" : data.original_title
                  },
                  layout: function(make, view) {
                    var preView = view.prev
                    make.top.equalTo(preView.bottom)
                    make.left.equalTo(preView.left)
                  }
                },
                {
                  // Genres
                  type: "label",
                  props: {
                    font: $font(12),
                    bgcolor: $color("#F5F5F5"),
                    textColor: $color("#666666"),
                    radius: 2,
                    text: " " + data.genres.join(" | ") + " "
                  },
                  layout: function(make, view) {
                    var preView = view.prev
                    make.top.equalTo(preView.bottom).offset(5)
                    make.left.equalTo(preView.left)
                    make.height.equalTo(20)
                  }
                },
                {
                  // Director
                  type: "label",
                  props: {
                    font: $font(12),
                    textColor: $color("#666666"),
                    autoFontSize: true,
                    text: "导演: " + data.directors.map(function(x) {
                      return x.name
                    }).join(" / ")
                  },
                  layout: function(make, view) {
                    var width = $device.info.screen.width
                    var preView = view.prev
                    make.top.equalTo(preView.bottom).offset(5)
                    make.left.equalTo(preView.left)
                    make.right.inset(10)
                  }
                },
                {
                  // Cast
                  type: "label",
                  props: {
                    font: $font(12),
                    textColor: $color("#666666"),
                    autoFontSize: true,
                    text: "主演: " + data.casts.map(function(x) {
                      return x.name
                    }).join(" / ")
                  },
                  layout: function(make, view) {
                    var width = $device.info.screen.width
                    var preView = view.prev
                    make.top.equalTo(preView.bottom).offset(5)
                    make.left.equalTo(preView.left)
                    make.right.inset(10)
                  }
                }
              ]
            }]
          },
          {
            title: "Summary",
            rows: [{
              type: "text",
              props: {
                id: "test",
                editable: false,
                selectable: false,
                font: $font(15),
                textColor: $color("#666666"),
                text: data.summary
              },
              layout: $layout.fill
            }]
          }
        ],
        header: {
          type: "view",
          props: {
            // Cover Image: 1:1.4
            height: 280 + 20
          },
          views: [{
              type: "image",
              props: {
                radius: 5,
                src: data.images.large
              },
              layout: function(make, view) {
                make.centerX.equalTo(view.super).offset(-60)
                make.width.equalTo(200)
                make.top.bottom.inset(10)
              }
            },
            {
              type: "view",
              props: {
                radius: 5,
                bgcolor: $color("white")
              },
              layout: function(make, view) {
                var preView = view.prev
                make.left.equalTo(preView.right).offset(20)
                make.width.height.equalTo(100)
                make.top.inset(30)
              },
              views: [{
                  // Starts
                  type: "label",
                  props: {
                    align: $align.center,
                    textColor: $color("#666666"),
                    text: star(data.rating.stars)
                  },
                  layout: function(make, view) {
                    make.centerX.equalTo(view.super)
                    make.height.equalTo(20)
                    make.bottom.inset(15)
                  }
                },
                {
                  // Average Rate
                  type: "label",
                  props: {
                    font: $font("bold", 30),
                    autoFontSize: true,
                    align: $align.center,
                    textColor: $color("#666666"),
                    text: data.rating.average == 0 ? "Null" : data.rating.average.toString()
                  },
                  layout: function(make, view) {
                    make.centerX.equalTo(view.super)
                    make.width.height.equalTo(50)
                    make.top.inset(10)
                  }
                }
              ]
            }
          ]
        },
        footer: {
          props: {
            height: 100
          }
        }
      },
      layout: $layout.fill,
      events: {
        rowHeight: function(sender, indexPath) {
          if (indexPath.section == 0) {
            return 120
          } else {
            return 180
          }
        }
      }
    }]
  })
}

function activeMenu(dstViewId) {
  var viewId = $("content").views.filter(function(x) {
    return x.hidden == false
  })[0].info
  if (dstViewId == viewId) {
    $ui.animate({
      duration: 0.3,
      animation: function() {
        $(dstViewId).contentOffset = $point(0, 0)
      }
    })
  } else {
    $(viewId + "_button").tintColor = $color("lightGray")
    $(dstViewId + "_button").tintColor = $color("darkGray")
    $(viewId).hidden = true
    $(dstViewId).hidden = false
  }
}

function fetchCache(idx) {
  var cache
  if (idx == 1) {
    cache = $cache.get("comingSoon")
  } else if (idx == 0) {
    cache = $cache.get("onScreen")
  }
  // Show Cache or Fetch
  if (typeof(cache) == "undefined") {
    fetchRecent(idx)
  } else {
    $("recent").data = cache[0]
    // Upadate Page Info
    $("page").text = cache[1]
  }
}

function fetchRecent(type = ON_SCREEN, pulled = false, start = 0) {
  var prePage = $("page").text
  $("page").text = "Loading..."

  var title = $("segment").items[type]
  var data = [{
    title: title,
    rows: []
  }]
  var uri = (type == ON_SCREEN) ? "in_theaters" : "coming_soon"
  var count = SETTING_FILE[0][2]
  $ui.loading(true)
  $http.get({
    url: "https://api.douban.com/v2/movie/" + uri + "?start=" + start + "&count=" + count,
    handler: function(resp) {
      $ui.loading(false)
      var status = resp.response.statusCode
      if (status != "200") {
        $("page").text = prePage
        $("recent").endFetchingMore()
        $ui.alert({
          title: status,
          message: "Public API has limit of request frequency, take a rest :)",
          actions: [{
            title: "OK",
            style: "Cancel"
          }]
        })
        return
      }
      var res = resp.data.subjects
      var resLen = res.length
      var total = resp.data.total
      if (res.length === 0) {
        $("page").text = prePage
        $ui.toast("No result")
        return
      }
      var quality = SETTING_FILE[0][0]
      var pageLastIndex = (start + resLen) > total ? total : (start + resLen)
      var page = pageLastIndex + " / " + total
      var idx = 0
      for (var i of res) {
        var d = {
          cover: {
            src: i.images[quality]
          },
          title: {
            text: i.title
          },
          original: {
            text: i.original_title == i.title ? "" : "(" + i.original_title + ")"
          },
          genres: {
            text: " " + i.genres.join(" | ") + " "
          },
          director: {
            text: "导演: " + i.directors.map(function(x) {
              return x.name
            }).join(" / ")
          },
          cast: {
            text: "主演: " + i.casts.map(function(x) {
              return x.name
            }).join(" / ")
          },
          id: i.id
        }
        // Insert Each Result
        if (start > 0) {
          $("recent").insert({
            indexPath: $indexPath(0, start + idx),
            value: d
          })
        } else {
          data[0].rows.push(d)
        }
        idx++
      }
      // Upadate Page Info
      $("page").text = page
      $("recent").endFetchingMore()
      // Update Results
      if (start === 0) {
        $("recent").data = data
      }
      if (pulled) {
        $("recent").endRefreshing()
        $ui.toast("Refreshed")
      }
      // Cache
      if (SETTING_FILE[0][3]) {
        if (type == ON_SCREEN) {
          $cache.set("onScreen", [$("recent").data, page])
        } else if (type == COMING_SOON) {
          $cache.set("comingSoon", [$("recent").data, page])
        }
      }
    }
  })
}

function fetchQuery(keyword, pulled = false, start = 0) {
  var prePage = $("page").text
  $("page").text = "Loading..."

  var data = [{
    title: "Query Results",
    rows: []
  }]
  var count = SETTING_FILE[0][2]
  $ui.loading(true)
  $http.get({
    url: "https://api.douban.com/v2/movie/search?q=" + encodeURI(keyword) + "&start=" + start + "&count=" + count,
    handler: function(resp) {
      $ui.loading(false)
      var status = resp.response.statusCode
      if (status != "200") {
        $("page").text = prePage
        $("recent").endFetchingMore()
        $ui.alert({
          title: status,
          message: "Public API has limit of request frequency, take a rest :)",
          actions: [{
            title: "OK",
            style: "Cancel"
          }]
        })
        return
      }
      var res = resp.data.subjects
      var resLen = res.length
      var total = resp.data.total
      if (res.length === 0) {
        $("page").text = prePage
        $ui.toast("No result")
        return
      }
      var quality = SETTING_FILE[0][0]
      var pageLastIndex = (start + resLen) > total ? total : (start + resLen)
      var page = pageLastIndex + " / " + total
      var idx = 0
      for (var i of res) {
        var d = {
          cover: {
            src: i.images[quality]
          },
          title: {
            text: i.title
          },
          original: {
            text: i.original_title == i.title ? "" : "(" + i.original_title + ")"
          },
          genres: {
            text: " " + i.genres.join(" | ") + " "
          },
          director: {
            text: "导演: " + i.directors.map(function(x) {
              return x.name
            }).join(" / ")
          },
          cast: {
            text: "主演: " + i.casts.map(function(x) {
              return x.name
            }).join(" / ")
          },
          id: i.id
        }
        // Insert Each Result
        if (start > 0) {
          $("recent").insert({
            indexPath: $indexPath(0, start + idx),
            value: d
          })
        } else {
          data[0].rows.push(d)
        }
        idx++
      }
      // Upadate Page Info
      $("page").text = page
      $("recent").endFetchingMore()
      // Update Results
      if (start === 0) {
        $("recent").data = data
      }
      if (pulled) {
        $("recent").endRefreshing()
        $ui.toast("Refreshed")
      }
    }
  })
}

function favoriteItem(cellData) {
  $("favorite").insert({
    indexPath: $indexPath(0, 0),
    value: cellData
  })
  FAVORITE_FILE[0].rows.unshift(cellData)
  saveFavorite(FAVORITE_FILE)
  $ui.toast("Favorited")
}

function favoriteItemDelete(indexPath) {
  var section = indexPath.section
  var row = indexPath.row
  FAVORITE_FILE[section].rows.splice(row, 1)
  saveFavorite(FAVORITE_FILE)
}

function favoriteCheckUncheck(cellData, indexPath) {
  var section = indexPath.section
  var row = indexPath.row
  $("favorite").delete(indexPath)
  if (SETTING_FILE[1][0]) {
    if (section === 0) {
      $("favorite").insert({
        indexPath: $indexPath(1, 0),
        value: cellData
      })
      $ui.toast("Checked")
    } else {
      $("favorite").insert({
        indexPath: $indexPath(0, 0),
        value: cellData
      })
      $ui.toast("Unchecked")
    }
    FAVORITE_FILE = $("favorite").data
    saveFavorite(FAVORITE_FILE)
  } else {
    FAVORITE_FILE[0].rows.splice(row, 1)
    FAVORITE_FILE[1].rows.unshift(cellData)
    $ui.toast("Checked")
    saveFavorite(FAVORITE_FILE)
  }
}

function settingMenu(section, row, data) {
  $ui.menu({
    items: data.map(function(x) { return x.name }),
    handler: function(title, idx) {
      var value = data[idx].value
      var current = $("setting").data
      // Update Data
      current[section].rows[row].value.text = data[idx].name
      $("setting").data = current
      if (section == 1 && row == 1) {
        // Path Value Before
        var path = SETTING_FILE[1][1]
        var favor = FAVORITE_FILE
        $file.delete(path + "Setting.conf")
        $file.delete(path + "Favorite.conf")
        // Update Path Value
        SETTING_FILE[1][1] = value
        saveFavorite(favor)
      }
      saveSetting(section, row, value)
    }
  })
}

function activeSettingMenu(indexPath) {
  var section = indexPath.section
  var row = indexPath.row
  var data
  if (section == 0) {
    if (row == 0) {
      // Cover Image Quality
      data = MENU.COVER_IMAGE_QUALITY
      settingMenu(section, row, data)
    } else if (row == 1) {
      // Recent Main Index
      data = MENU.RECENT_MAIN_INDEX
      settingMenu(section, row, data)
    } else if (row == 4) {
      // Clear Cache
      $ui.alert({
        title: "Clear Cache",
        message: "Sure to clear all the caches?",
        actions: [{
            title: "OK",
            handler: function() {
              $cache.clear()
              $ui.toast("Done")
            }
          },
          {
            title: "Cancel",
            style: "Cancel"
          }
        ]
      })
    } else if (row == 5) {
      // Reset
      $ui.action({
        title: "Reset",
        message: "You can reset all settings to default, or erase favorited content and settings",
        actions: [{
            title: "Reset All Settings",
            handler: function() {
              $ui.alert({
                title: "Warning",
                message: "Sure to reset all settings to default?",
                actions: [{
                    title: "OK",
                    handler: function() {
                      resetSetting()
                      main()
                      $ui.toast("Done")
                    }
                  },
                  {
                    title: "Cancel",
                    style: "Cancel"
                  }
                ]
              })
            }
          },
          {
            title: "Erase All Content and Settings",
            handler: function() {
              $ui.alert({
                title: "Warning",
                message: "Sure to erase all favorited content and settings?",
                actions: [{
                    title: "OK",
                    handler: function() {
                      eraseAll()
                      main()
                      $ui.toast("Done")
                    }
                  },
                  {
                    title: "Cancel",
                    style: "Cancel"
                  }
                ]
              })
            }
          }
        ]
      })
    }
  } else if (section == 1) {
    if (row == 1) {
      // Saving Path
      data = MENU.SAVING_PATH
      settingMenu(section, row, data)
    }
  }
}

function toggleFavorited(state) {
  if (state) {
    $("favorite").data = FAVORITE_FILE
  } else {
    $("favorite").data = [FAVORITE_FILE[0]]
  }
}

function saveSetting(section, row, value) {
  var path = SETTING_FILE[1][1]
  // Update Value
  SETTING_FILE[section][row] = value
  $file.write({
    data: $data({ string: JSON.stringify(SETTING_FILE) }),
    path: path + "Setting.conf"
  })
}

function saveSettingAsDefault() {
  var path = SETTING_FILE[1][1]
  SETTING = $file.write({
    data: $data({ string: JSON.stringify(DEFAULT) }),
    path: path + "Setting.conf"
  })
}

function saveFavorite(data) {
  var path = SETTING_FILE[1][1]
  // Update Value
  FAVORITE_FILE = data
  $file.write({
    data: $data({ string: JSON.stringify(data) }),
    path: path + "Favorite.conf"
  })
}

function resetSetting() {
  var path = SETTING_FILE[1][1]
  // Reset Setting
  $file.delete(path + "Setting.conf")
  SETTING = 0
  SETTING_FILE = JSON.parse(JSON.stringify(DEFAULT))
  // Move Favorite
  var favor = FAVORITE_FILE
  $file.delete(path + "Favorite.conf")
  saveFavorite(favor)
}

function eraseAll() {
  var path = SETTING_FILE[1][1]
  // Reset Setting
  $file.delete(path + "Setting.conf")
  SETTING = 0
  SETTING_FILE = JSON.parse(JSON.stringify(DEFAULT))
  // Reset Favorite
  $file.delete(path + "Favorite.conf")
  FAVORITE = 0
  FAVORITE_FILE = [{ title: "Favorite", rows: [] }, { title: "Checked", rows: [] }]
}

function star(str) {
  var star = parseInt(str[0])
  var starString = ""
  for (var i = 0; i < 5; i++) {
    starString += i < star ? "★" : "☆"
  }
  return starString
}

function main() {
  generateMainViewObjects()
  mainView()
  // Get Recent
  if (SETTING_FILE[0][3]) {
    var cacheName = SETTING_FILE[0][1] ? "comingSoon" : "onScreen"
    var cache = $cache.get(cacheName)
    if (typeof(cache) == "undefined") {
      fetchRecent(SETTING_FILE[0][1])
    } else {
      $("recent").data = cache[0]
      // Upadate Page Info
      $("page").text = cache[1]
    }
  } else {
    fetchRecent(SETTING_FILE[0][1])
  }
}

/* Main */
main()
