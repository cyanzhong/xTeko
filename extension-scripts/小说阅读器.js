$app.validEnv = $env.app | $env.action
$ui.render({
  type: "view",
  props: {
    title: "开卷有益",
    bgcolor: $color("#008080")
  },
  views: [{
      type: "label",
      props: {
        id: "bookCaseCount",
        bgcolor: $color("white"),
        height: 35,
        font: $font("bold", 16),
        textColor: $color("#008080"),
        autoFontSize: true,
        text: "  正在加载..."
      },
      layout: function(make, view) {
        make.top.equalTo(0)
        make.height.equalTo(35)
        make.width.equalTo(view.super)
      }
    }, {
      type: "list",
      props: {
        id: "bcList",
        bgcolor: $color("#eeeeee"),
        rowHeight: 70,
        actions: [{
          title: "删除",
          handler: function(sender, indexPath) {
            $device.taptic(0)
            bcDataWrite(bcIds[indexPath.row], "del", indexPath.row)
          }
        }],
        template: [{
            type: "view",
            props: {
              bgcolor: $color("white")
            },
            layout: $layout.fill
          },
          {
            type: "image",
            props: {
              id: "cover",
              radius: 3
            },
            layout: function(make, view) {
              make.left.top.bottom.inset(10)
              make.width.equalTo(40)
            }
          },
          {
            type: "button",
            props: {
              id: "bookCaseDetail",
              type: 4
            },
            layout: function(make, view) {
              make.top.bottom.right.inset(10)
              make.width.equalTo(view.height)
            },
            events: {
              tapped(sender) {
                $device.taptic(0)
                bookDetailView(sender.info)
              }
            }
          },
          {
            type: "label",
            props: {
              id: "title",
              font: $font("bold", 16),
              autoFontSize: true
            },
            layout: function(make, view) {
              make.top.inset(3)
              make.height.equalTo(30)
              make.left.equalTo($("cover").right).offset(10)
              make.right.equalTo($("bookCaseDetail").left).offset(-5)
            }
          },
          {
            type: "label",
            props: {
              id: "lastChapter",
              font: $font(14),
              lines: 2
            },
            layout: function(make, view) {
              make.bottom.inset(3)
              make.height.equalTo(34)
              make.right.equalTo($("bookCaseDetail").left).offset(-5)
              make.left.equalTo($("cover").right).offset(10)
            }
          }
        ]
      },
      layout: function(make, view) {
        make.top.equalTo($("bookCaseCount").bottom).offset(1)
        make.bottom.inset(46)
        make.width.equalTo(view.super)
      },
      events: {
        pulled(sender) {
          if (bcData.length > 0) {
            bookCaseUpdateCheck()
          } else {
            $device.taptic(0)
          }
          sender.super.endRefreshing()
        },
        didSelect: function(sender, indexPath, data) {
          selectBookName = data.bookname;
          chapterView();
          getBookSource(data.bookid);
          var index = updated.indexOf(data.bookid);
          if (index > -1) {
            updated.splice(index, 1)
          };
          loadBookCaseData()
        }
      }
    },
    {
      type: "button",
      props: {
        id: "searchButton",
        title: "搜索",
        radius: 0,
        titleColor: $color("#008080"),
        bgcolor: $color("white"),
        font: $font("bold", 19),
        align: $align.center
      },
      layout: function(make, view) {
        make.bottom.left.inset(0), make.height.equalTo(45)
        make.width.equalTo(view.super).dividedBy(3)
      },
      events: {
        tapped(sender) {
          bookSearchView()
        }
      }
    },
    {
      type: "button",
      props: {
        id: "topButton",
        title: "排行",
        radius: 0,
        titleColor: $color("#008080"),
        bgcolor: $color("white"),
        font: $font("bold", 19),
        align: $align.center
      },
      layout: function(make, view) {
        make.bottom.inset(0)
        make.height.equalTo(45)
        make.left.equalTo($("searchButton").right)
        make.width.equalTo(view.super).dividedBy(3)
      },
      events: {
        tapped(sender) {
          bookTopView()
          getBookTopSources()
        }
      }
    },
    {
      type: "button",
      props: {
        id: "bookListButton",
        title: "书单",
        radius: 0,
        titleColor: $color("#008080"),
        bgcolor: $color("white"),
        font: $font("bold", 19),
        align: $align.center
      },
      layout: function(make, view) {
        make.bottom.inset(0)
        make.height.equalTo(45)
        make.left.equalTo($("topButton").right)
        make.width.equalTo(view.super).dividedBy(3)
      },
      events: {
        tapped(sender) {
          bookListData = []
          bookListView()
          getBookList()
        }
      }
    }
  ]
})

// 小说详情视图
function bookDetailView(bookid, mode) {
  $http.get({
    url: "http://api.zhuishushenqi.com/book/" + bookid,
    header: Header,
    handler: function(resp) {
      $ui.push({
        props: {
          bgcolor: $color("white"),
          title: resp.data.title
        },
        views: [{
            type: "image",
            props: {
              id: "detailCover",
              radius: 5,
              src: encodeURI("http://statics.zhuishushenqi.com" + $text.URLDecode(resp.data.cover))
            },
            layout: function(make, view) {
              make.left.top.inset(15)
              make.width.equalTo(110)
              make.height.equalTo(150)
            }
          },
          {
            type: "label",
            props: {
              id: "detailInfo",
              text: "作者：" + resp.data.author + "\n\n分类：" + resp.data.cat + "\n\n总字数：" + resp.data.wordCount + "\n\n最新章节：" + resp.data.lastChapter,
              lines: 0,
              font: $font(16),
              autoFontSize: true
            },
            layout: function(make, view) {
              make.top.right.inset(15)
              make.left.equalTo($("detailCover").right).offset(30)
              make.height.equalTo(170)
            }
          },
          {
            type: "label",
            props: {
              textColor: $color("white"),
              radius: 2,
              align: $align.center,
              font: $font(14),
              bgcolor: $color("red"),
              text: String(Math.round(resp.data.latelyFollower) + "人气"),
              autoFontSize: true
            },
            layout: function(make, view) {
              make.top.equalTo($("detailCover").bottom).offset(5)
              make.height.equalTo(20)
              make.width.equalTo(90)
              make.centerX.equalTo($("detailCover").centerX)
            }
          },
          {
            type: "button",
            props: {
              title: !casebook(bookid) ? "＋追更新" : "－不追了",
              id: "detailAdd",
              bgcolor: !casebook(bookid) ? $color("#992300") : $color("lightGray")
            },
            layout: function(make, view) {
              make.left.inset(45)
              make.bottom.inset(60)
              make.width.equalTo(130)
              make.height.equalTo(40)
            },
            events: {
              tapped(sender) {
                if (!casebook(bookid)) {
                  sender.bgcolor = $color("lightGray")
                  sender.title = "－不追了"
                  bcDataWrite(bookid, "add", resp.data)
                } else {
                  sender.bgcolor = $color("#992300")
                  sender.title = "＋追更新"
                  bcDataWrite(bookid, "del", bcIds.indexOf(bookid))
                }
              }
            }
          },
          {
            type: "button",
            props: {
              title: "分享链接",
              bgcolor: $color("#992300")
            },
            layout: function(make, view) {
              make.right.inset(45)
              make.bottom.inset(60)
              make.width.equalTo(130)
              make.height.equalTo(40)
            },
            events: {
              tapped(sender) {
                $share.sheet("https://m.zhuishushenqi.com/books/" + resp.data._id)
              }
            }
          },
          {
            type: "text",
            props: {
              bgcolor: $color("#eeeeee"),
              radius: 5,
              text: resp.data.shortIntro || resp.data.longIntro,
              font: $font(16),
              autoFontSize: true,
              editable: false,
              showsVerticalIndicator: false
            },
            layout: function(make, view) {
              make.top.equalTo($("detailInfo").bottom).offset(30)
              make.left.right.inset(20)
              make.bottom.equalTo($("detailAdd").top).offset(-30)
            }
          }
        ]
      })
    }
  })
}

// 小说搜索视图
function bookSearchView() {
  $ui.push({
    type: "view",
    props: {
      id: "bookSearchView",
      title: "小说搜索",
      bgcolor: $color("#008080")
    },
    views: [{
      type: "input",
      props: {
        id: "bsKeyword",
        bgcolor: $color("white"),
        text: "输入书名或作者名搜索",
        clearsOnBeginEditing: true,
        font: $font(18),
        radius: 0
      },
      layout: function(make, view) {
        make.top.left.right.inset(0)
        make.height.equalTo(50)
      },
      events: {
        returned(sender) {
          sender.blur()
          bookSearch(sender.text)
        }
      }
    }, {
      type: "label",
      props: {
        id: "bsCount",
        bgcolor: $color("#eeeeee"),
        font: $font("bold", 16),
        textColor: $color("#008080"),
        autoFontSize: true
      },
      layout: function(make, view) {
        make.top.equalTo($("bsKeyword").bottom).offset(1)
        make.height.equalTo(35)
        make.left.right.inset(0)
      }
    }, {
      type: "list",
      props: {
        id: "bsList",
        rowHeight: 70,
        bgcolor: $color("#eeeeee"),
        footer: {
          type: "label",
          props: {
            id: "bsFooter",
            height: 50,
            text: "加载中...",
            textColor: $color("#008080"),
            align: $align.center,
            font: $font(12)
          }
        },
        template: [{
            type: "view",
            props: {
              bgcolor: $color("white")
            },
            layout: $layout.fill
          },
          {
            type: "image",
            props: {
              id: "cover",
              radius: 3
            },
            layout: function(make, view) {
              make.left.top.bottom.inset(10)
              make.width.equalTo(40)
            }
          },
          {
            type: "button",
            props: {
              id: "bsAdd",
              type: 5
            },
            layout: function(make, view) {
              make.top.bottom.right.inset(5)
              make.width.equalTo(40)
            },
            events: {
              tapped(sender) {
                $device.taptic(0);
                bcDataWrite(sender.info._id, "add");
                sender.alpha = 0.1
              }
            }
          },
          {
            type: "button",
            props: {
              id: "bsDetail",
              type: 2
            },
            layout: function(make, view) {
              make.top.bottom.inset(10)
              make.right.equalTo($("bsAdd").left).offset(-15)
              make.width.equalTo(40)
            },
            events: {
              tapped(sender) {
                $device.taptic(0)
                bookDetailView(sender.info)
              }
            }
          },
          {
            type: "label",
            props: {
              id: "title",
              font: $font("bold", 16)
            },
            layout: function(make, view) {
              make.top.inset(3)
              make.height.equalTo(30)
              make.left.equalTo($("cover").right).offset(10)
              make.right.equalTo($("bsDetail").left).offset(-5)
            }
          },
          {
            type: "label",
            props: {
              id: "author",
              font: $font(14),
              textColor: $color("#008080"),
              lines: 2,
              autoFontSize: true
            },
            layout: function(make, view) {
              make.bottom.inset(3)
              make.height.equalTo(34)
              make.right.equalTo($("bsDetail").left).offset(-5)
              make.left.equalTo($("cover").right).offset(10)
            }
          }
        ]
      },
      layout: function(make, view) {
        make.top.equalTo($("bsCount").bottom)
        make.bottom.inset(0)
        make.left.right.inset(0)
      },
      events: {
        didReachBottom: function(sender) {
          if (bookSearchData.length > 0) {
            $("bsList").data = $("bsList").data.concat(bookSearchData.splice(0, 20))
          } else {
            $("bsFooter").text = "到底了";
            $device.taptic(0)
          }
          sender.endFetchingMore()
        },
        didSelect: function(sender, indexPath, data) {
          selectBookName = data.bookname;
          chapterView();
          getBookSource(data.bookid)
        }
      }
    }]
  })
  bsDefault()
}

//搜索界面初始加载数据
function bsDefault() {
  $http.get({
    url: "https://api.zhuishushenqi.com/recommendPage/node/books/all/57832d0fbe9f970e3dc4270c?ajax=ajax&st=1&size=100",
    header: Header,
    handler: function(resp) {
      $("bsCount").text = "  本周热推";
      var data = [];
      resp.data.data.map(function(i) {
        var item = i.book;
        data.push({
          bookid: item._id,
          bookname: item.title,
          bsDetail: {
            info: item._id
          },
          bsAdd: {
            info: item,
            alpha: !casebook(item._id) ? 1 : 0.1
          },
          cover: {
            src: item.cover
          },

          title: {
            text: item.title
          },
          author: {
            text: "作者：" + item.author
          }
        })
      });
      bookSearchData = data;
      $("bsList").data = bookSearchData.splice(0, 20)
    }
  })
}

// 小说搜索
function bookSearch(keyword) {
  $http.get({
    url: encodeURI("http://api.zhuishushenqi.com/book/fuzzy-search?query=" + keyword + "&start=0&limit=100"),
    header: Header,
    handler: function(resp) {
      var json = resp.data.books
      $("bsCount").text = " 共搜索到" + json.length + "本书"
      var data = []
      json.map(function(item) {
        data.push({
          bookid: item._id,
          bookname: item.title,
          bsDetail: {
            info: item._id
          },
          bsAdd: {
            info: item,
            alpha: !casebook(item._id) ? 1 : 0.1
          },
          cover: {
            src: encodeURI("http://statics.zhuishushenqi.com" + $text.URLDecode(item.cover))
          },

          title: {
            text: item.title
          },
          author: {
            text: item.author
          }
        })
      })
      bookSearchData = data
      $("bsList").data = bookSearchData.splice(0, 20)
    }
  })
}

// 排行榜视图
function bookTopView() {
  $ui.push({
    props: {
      id: "bookTopView",
      title: "排行榜",
      bgcolor: $color("#008080")
    },
    views: [{
        type: "menu",
        props: {
          id: "btChannel1",
          items: ["男生", "女生"],
          index: 0
        },
        layout: function(make, view) {
          make.top.left.inset(0)
          make.width.equalTo(150)
          make.height.equalTo(35)
        },
        events: {
          changed(sender) {
            getBookTopSources()
          }
        }

      }, {
        type: "menu",
        props: {
          id: "btChannel2",
          items: ["周榜", "月榜", "总榜"],
          index: 0
        },
        layout: function(make, view) {
          make.top.right.inset(0)
          make.left.equalTo($("btChannel1").right)
          make.height.equalTo(35)
        },
        events: {
          changed(sender) {
            getTopBooks()
          }
        }
      },
      {
        type: "list",
        props: {
          id: "btSourceList",
          rowHeight: 45,
          showsVerticalIndicator: false,
          bgcolor: $color("#eeeeee"),
          template: [{
            type: "label",
            props: {
              id: "btSourceName",
              align: $align.center,
              autoFontSize: true,
              textColor: $color("#008080"),
              bgcolor: $color("#eeeeee")
            },
            layout: $layout.fill
          }]
        },
        layout: function(make, view) {
          make.top.equalTo($("btChannel1").bottom).offset(1)
          make.bottom.left.inset(0)
          make.width.equalTo(90)
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            sourceRow = indexPath.row;
            getTopBooks()
          }
        }
      },
      {
        type: "list",
        props: {
          id: "btBooks",
          rowHeight: 70,
          bgcolor: $color("#eeeeee"),
          footer: {
            type: "label",
            props: {
              id: "btFooter",
              height: 50,
              text: "加载中...",
              textColor: $color("#008080"),
              align: $align.center,
              font: $font(12)
            }
          },
          template: [{
              type: "view",
              props: {
                bgcolor: $color("white")
              },
              layout: $layout.fill
            },
            {
              type: "image",
              props: {
                id: "btCover",
                radius: 3
              },
              layout: function(make, view) {
                make.left.bottom.top.inset(10)

                make.width.equalTo(40)
              }
            },
            {
              type: "button",
              props: {
                id: "bookTopAdd",
                type: 5
              },
              layout: function(make, view) {
                make.top.bottom.right.inset(5)
                make.width.equalTo(30)
              },
              events: {
                tapped(sender) {
                  $device.taptic(0);
                  bcDataWrite(sender.info._id, "add");
                  sender.alpha = 0.1
                }
              }
            },
            {
              type: "button",
              props: {
                id: "bookTopDetail",
                type: 2
              },
              layout: function(make, view) {
                make.top.bottom.inset(5)
                make.right.equalTo($("bookTopAdd").left).offset(-10)
                make.width.equalTo(30)
              },
              events: {
                tapped(sender) {
                  $device.taptic(0)
                  bookDetailView(sender.info)
                }
              }
            },
            {
              type: "label",
              props: {
                id: "bookTopTitle",
                font: $font("bold", 16),
                lines: 2
              },
              layout: function(make, view) {
                make.top.inset(3)
                make.height.equalTo(30)
                make.left.equalTo($("btCover").right).offset(5)
                make.right.equalTo($("bookTopDetail").left).offset(-5)
              }
            },
            {
              type: "label",
              props: {
                id: "bookTopAuthor",
                font: $font(14),
                textColor: $color("#008080"),
                lines: 2,
                autoFontSize: true
              },
              layout: function(make, view) {
                make.bottom.inset(3)
                make.height.equalTo(34)
                make.right.equalTo($("bookTopDetail").left).offset(-5)
                make.left.equalTo($("btCover").right).offset(5)
              }
            }
          ]
        },
        layout: function(make, view) {
          make.top.equalTo($("btChannel1").bottom).offset(1)
          make.bottom.right.inset(0)
          make.left.equalTo($("btSourceList").right).offset(0.5)
        },
        events: {
          didReachBottom: function(sender) {
            if (bookTopData.length > 0) {
              $("btBooks").data = $("btBooks").data.concat(bookTopData.splice(0, 20))
            } else {
              $("btFooter").text = "到底了",
                $device.taptic(0)
            }
            sender.endFetchingMore()
          },
          didSelect: function(sender, indexPath, data) {
            selectBookName = data.bookname;
            chapterView();
            getBookSource(data.bookid)
          }
        }
      }
    ]
  })
}

// 获取排行榜源
function getBookTopSources() {
  $http.get({
    url: "http://api.zhuishushenqi.com/v3/ranking/gender",
    Header: Header,
    handler: function(resp) {
      bookTopSourceData = $("btChannel1").index == 0 ? resp.data.male : resp.data.female
      var data = []
      bookTopSourceData.map(function(item) {
        data.push({
          info: item,
          btSourceName: {
            text: item.title
          }
        })
      })
      $("btSourceList").data = data
      sourceRow = false
      getTopBooks()
    }
  })
}

// 获取排行榜单内小说
function getTopBooks() {
  var source = sourceRow || 0;
  var channel = $("btChannel2").index
  var id
  if (channel == 0) {
    id = bookTopSourceData[source]._id
  } else if (channel == 1) {
    id = bookTopSourceData[source].monthRank
  } else if (channel == 2) {
    id = bookTopSourceData[source].totalRank
  }
  if (!id) {
    id = bookTopSourceData[source]._id
  }
  $http.get({
    url: "http://api.zhuishushenqi.com/ranking/" + id,
    header: Header,
    handler: function(resp) {
      var topBookData = resp.data.ranking
      var data = []
      topBookData.books.map(function(item) {
        data.push({
          bookid: item._id,
          bookname: item.title,
          btCover: { src: encodeURI("http://statics.zhuishushenqi.com" + $text.URLDecode(item.cover)) },
          bookTopTitle: { text: item.title },
          bookTopAuthor: { text: "作者:" + item.author },
          bookTopDetail: {
            info: item._id
          },
          bookTopAdd: {
            info: item,
            alpha: !casebook(item._id) ? 1 : 0.1
          }
        })
      })
      bookTopData = data
      $("btBooks").data = bookTopData.splice(0, 20)
    }
  })
}

// 书单主视图
function bookListView() {
  $ui.push({
    props: {
      title: "书单",
      bgcolor: $color("#008080")
    },
    views: [{
      type: "menu",
      props: {
        id: "blChannel",
        items: ["本周最热", "最新发布", "收藏最多"]
      },
      layout: function(make, view) {
        make.top.left.right.inset(0)
        make.top.height.equalTo(35)
      },
      events: {
        changed(sender) {
          bookListData = []
          getBookList()
        }
      }

    }, {
      type: "list",
      layout: function(make, view) {
        make.top.equalTo($("blChannel").bottom).offset(1)
        make.left.right.bottom.inset(0)
      },
      events: {
        didReachBottom(sender) {
          getBookList(bookListData.length)
          sender.endFetchingMore()
        },
        didSelect: function(sender, indexPath, data) {
          blBooksView();
          blBooksData = [];
          getBookListBooks(data.id)
        }
      },
      props: {
        id: "bookList",
        rowHeight: 90,
        bgcolor: $color("#eeeeee"),
        template: [{
            type: "view",
            props: {
              bgcolor: $color("white")
            },
            layout: $layout.fill
          }, {
            type: "image",
            props: {
              id: "blCover",
              radius: 3
            },
            layout: function(make, view) {
              make.top.left.bottom.inset(10)
              make.width.equalTo(52)
            }
          },
          {
            type: "label",
            props: {
              id: "blTitle",
              font: $font("bold", 16),
              autoFontSize: true,
              textColor: $color("#008080"),
            },
            layout: function(make, view) {
              make.top.right.inset(5)
              make.left.equalTo($("blCover").right).offset(10)
              make.height.equalTo(20)
            }
          }, {
            type: "label",
            props: {
              id: "blInfo",
              font: $font(13),
              lines: 2,
              textColor: $color("#6e6e6e")
            },
            layout: function(make, view) {
              make.top.equalTo($("blTitle").bottom).offset(5)
              make.right.inset(10)
              make.left.equalTo($("blCover").right).offset(10)
              make.height.equalTo(35)
            }
          }, {
            type: "label",
            props: {
              id: "blCount",
              font: $font(13),
              textColor: $color("red")
            },
            layout: function(make, view) {
              make.left.equalTo($("blCover").right).offset(10)

              make.bottom.right.inset(5)
              make.top.equalTo($("blInfo").bottom).offset(5)
            }
          }
        ]
      }
    }]
  })
}

// 获取书单列表
function getBookList(num) {
  var num = num || 0;
  var urls = ["https://api.zhuishushenqi.com/book-list?sort=collectorCount&duration=last-seven-days&start=", "https://api.zhuishushenqi.com/book-list?sort=created&duration=all&start=", "https://api.zhuishushenqi.com/book-list?sort=collectorCount&duration=all&start="]
  $http.get({
    url: urls[$("blChannel").index] + num,
    handler: function(resp) {
      resp.data.bookLists.map(function(item) {
        bookListData.push({
          id: item._id,
          blCover: {
            src: encodeURI("http://statics.zhuishushenqi.com" + $text.URLDecode(item.cover))
          },
          blTitle: {
            text: item.title
          },
          blInfo: {
            text: item.desc.replace("\n", "")
          },
          blCount: {
            text: "共" + item.bookCount + "本书  |  " + item.collectorCount + "人收藏"
          }
        })
      })
      $("bookList").data = bookListData
    }
  })
}

// 选定书单内小说列表视图
function blBooksView() {
  $ui.push({
    type: "view",
    props: {
      id: "blBooksView",
      title: "书单详情",
      bgcolor: $color("#008080")
    },
    views: [{
        type: "view",
        props: {
          id: "blDes",
          bgcolor: $color("white"),
        },
        layout: function(make, view) {
          make.height.lessThanOrEqualTo(145)
          make.top.equalTo(0)
          make.left.right.inset(0)
        },

        views: [{
            type: "image",
            props: {
              id: "bldCover",
              radius: 25
            },
            layout: function(make, view) {
              make.top.left.inset(5)
              make.width.height.equalTo(50)
            }
          }, {
            type: "button",
            props: {
              id: "blDesShare",
              title: "分享书单",
              titleFont: $font(18),
              titleColor: $color("#008080"),
              bgcolor: $color("clear"),
              borderColor: $color("#008080"),
              borderWidth: 1
            },
            layout: function(make, view) {
              make.top.inset(12.5)
              make.right.inset(10)
              make.height.equalTo(35)
              make.width.equalTo(85)
            },
            events: {
              tapped(sender) {
                $share.sheet(sender.info)
              }
            }
          }, {
            type: "label",
            props: {
              id: "blDesAuthor",
              textColor: $color("red"),
              font: $font("bold", 18),
              autoFontSize: true
            },
            layout: function(make, view) {
              make.left.equalTo($("bldCover").right).offset(10)
              make.right.equalTo($("blDesShare").left).offset(-5)
              make.top.inset(15)
              make.height.equalTo(30)
            }
          },
          {
            type: "label",
            props: {
              id: "blDesTitle",
              autoFontSize: true,
              font: $font("bold", 16),
              textColor: $color("#008080")
            },
            layout: function(make, view) {
              make.top.equalTo($("bldCover").bottom).offset(10)
              make.left.right.inset(10)
              make.height.equalTo(18)
            }
          }, {
            type: "label",
            props: {
              id: "blDesInfo",
              lines: 0,
              font: $font(14)
            },
            layout: function(make, view) {
              make.top.equalTo($("blDesTitle").bottom).offset(5)
              make.left.right.bottom.inset(10)
            }
          }
        ]
      },
      {
        type: "list",
        props: {
          id: "blBooks",
          rowHeight: 70,
          bgcolor: $color("#eeeeee"),
          footer: {
            type: "label",
            props: {
              id: "blFooter",
              height: 50,
              text: "加载中...",
              textColor: $color("#008080"),
              align: $align.center,
              font: $font(12)
            }
          },
          template: [{
              type: "view",
              props: {
                bgcolor: $color("white")
              },
              layout: $layout.fill
            },
            {
              type: "image",
              props: {
                id: "cover",
                radius: 3
              },
              layout: function(make, view) {
                make.left.top.bottom.inset(10)
                make.width.equalTo(40)
              }
            },
            {
              type: "button",
              props: {
                id: "blAdd",
                type: 5
              },
              layout: function(make, view) {
                make.top.bottom.right.inset(5)
                make.width.equalTo(40)
              },
              events: {
                tapped(sender) {
                  $device.taptic(0);
                  bcDataWrite(sender.info, "add");
                  sender.alpha = 0.1
                }
              }
            },
            {
              type: "button",
              props: {
                id: "blDetail",
                type: 2
              },
              layout: function(make, view) {
                make.top.bottom.inset(10)
                make.right.equalTo($("blAdd").left).offset(-15)
                make.width.equalTo(40)
              },
              events: {
                tapped(sender) {
                  $device.taptic(0)
                  bookDetailView(sender.info)
                }
              }
            },
            {
              type: "label",
              props: {
                id: "title",
                font: $font("bold", 16)
              },
              layout: function(make, view) {
                make.top.inset(3)
                make.height.equalTo(30)
                make.left.equalTo($("cover").right).offset(10)
                make.right.equalTo($("blDetail").left).offset(-5)
              }
            },
            {
              type: "label",
              props: {
                id: "author",
                font: $font(14),
                textColor: $color("#008080"),
                autoFontSize: true
              },
              layout: function(make, view) {
                make.bottom.inset(3)
                make.height.equalTo(34)
                make.right.equalTo($("blDetail").left).offset(-5)
                make.left.equalTo($("cover").right).offset(10)
              }
            }
          ]
        },
        layout: function(make, view) {
          make.top.equalTo($("blDes").bottom).offset(1)
          make.bottom.inset(0)
          make.left.right.inset(0)
        },
        events: {
          didReachBottom(sender) {
            if (blBooksData.length > 0) {
              $("blBooks").data = $("blBooks").data.concat(blBooksData.splice(0, 20))
            } else {
              $("blFooter").text = "到底了";
              $device.taptic(0)
            }
            sender.endFetchingMore()
          },
          didSelect: function(sender, indexPath, data) {
            selectBookName = data.bookname;
            chapterView();
            getBookSource(data.bookid)
          }

        }
      }
    ]
  })
}

// 获取选定书单内小说
function getBookListBooks(id) {
  $http.get({
    url: "https://api.zhuishushenqi.com/book-list/" + id,
    handler: function(resp) {
      var author = resp.data.bookList.author;
      $("bldCover").src = encodeURI("http://statics.zhuishushenqi.com" + $text.URLDecode(author.avatar));
      $("blDesAuthor").text = author.nickname + "   Lv." + author.lv;
      $("blDesTitle").text = resp.data.bookList.title;
      $("blDesInfo").text = resp.data.bookList.desc.replace(/\n+/g, "\n");
      $("blDesShare").info = resp.data.bookList.shareLink;
      resp.data.bookList.books.map(function(i) {
        var item = i.book;
        blBooksData.push({
          bookid: item._id,
          bookname: item.title,
          cover: {
            src: encodeURI("http://statics.zhuishushenqi.com" + $text.URLDecode(item.cover))
          },
          title: {
            text: item.title
          },
          author: {
            text: "作者：" + item.author
          },
          blAdd: {
            info: item._id,
            alpha: !casebook(item._id) ? 1 : 0.1
          },
          blDetail: {
            info: item._id
          }

        })
      });
      $("blBooks").data = blBooksData.splice(0, 20)
    }
  })
}

var template = ` 
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style type="text/css">	
body {
background-color:#eeeeee;
font-family: <System>;
margin:0px;
margin-left:15px;
margin-right:15px;
padding:0px;
border:0px; }	
</style>
</head>
<body ondblclick="return false;">
<div id="text" style="font-size:22px;line-height:35px;letter-spacing:2px;text-indent:2em;">
<font color="#008080">{{TITLE}}</font><br/>{{CONTENT}}
</div>	
</body>
<script>
document.body.addEventListener("touchmove",function (event){event.preventDefault();}, false);
pageNum={{PAGE}};
</script>
</html> 
`

function reader() {
  $ui.push({
    type: "view",
    props: {
      title: selectBookName,
      bgcolor: $color("#008080")
    },
    views: [{
      type: "web",
      props: {
        id: "reader",
        script: function() {
          var pageHeight = document.body.scrollHeight;
          var scrollHeight = 595;

          function setPageHeight() {
            if (pageHeight % scrollHeight != 0) {
              addHeight = scrollHeight - pageHeight % scrollHeight;
              newPageHeight = pageHeight + addHeight;
              document.getElementById("text").style.height = newPageHeight + "px";
            }
          };

          function goTo(page) {
            scrollTo(0, page * scrollHeight)
          }

          function theme(color) {
            document.body.style.backgroundColor = color;
          }
          setPageHeight();
          goTo(pageNum);
          pageCount = newPageHeight / scrollHeight;
          document.getElementById("text").onmousedown = function(event) {
            var x1 = event.clientX;
            var x2 = window.screen.width;
            if (x1 > x2 / 2 && pageNum != pageCount - 1) {
              goTo(pageNum + 1);
              pageNum++;
              $notify("page", pageNum);
            } else if (x1 < x2 / 2 && pageNum > 0) {
              goTo(pageNum - 1);
              pageNum--;
              $notify("page", pageNum)
            } else if (pageNum == pageCount - 1) {
              $notify("nextPage", true)
            } else if (pageNum == 0) {
              $notify("prePage", true)
            }
          }
        }
      },
      layout: function(make, view) {
        make.top.inset(1)
        make.left.right.bottom.inset(0)
      },
      events: {
        nextPage: function(obj) {
          if (selectChapter == bookChapterData.length) {
            selectChapter = 0
          } else {
            selectChapter++;
          };
          getChapterContent(selectChapter, "goto")

        },
        prePage: function(obj) {
          if (selectChapter == 0) {
            selectChapter = bookChapterData.length - 1
          } else {
            selectChapter--
          };
          getChapterContent(selectChapter, "goto")
        },
        page: function(obj) {
          selectPage = obj;
          logWrite()
        }
      }
    }]
  })
}

function chapterView() {
  $ui.push({
    type: "view",
    props: {
      id: "chapterView",
      title: selectBookName
    },
    views: [{
        type: "button",
        props: {
          id: "setSource",
          bgcolor: $color("white"),
          title: "换源",
          borderColor: $color("white"),
          borderWidth: 1,
          titleColor: $color("#008080")
        },
        layout: function(make) {
          make.top.right.equalTo(0)
          make.width.equalTo(60)
          make.height.equalTo(30)
        },
        events: {
          tapped(sender) {
            $ui.menu({
              items: bookSourceName,
              handler: function(title, idx) {
                getBookChapter(bookSourceId[idx])
              }
            })
          }
        }
      }, {
        type: "label",
        props: {
          id: "sourceName",
          textColor: $color("#008080")
        },
        layout: function(make) {
          make.top.inset(0)
          make.left.inset(5)
          make.right.equalTo($("setSource").left)
          make.height.equalTo(30)
        }
      },
      {
        type: "view",
        props: {
          id: "line",
          bgcolor: $color("#008080")
        },
        layout: function(make) {
          make.left.right.inset(0)
          make.height.equalTo(1)
          make.top.equalTo($("sourceName").bottom)
        }
      },
      {
        type: "list",
        props: {
          id: "chapterList",
          rowHeight: 50,
          template: [{
            type: "label",
            props: {
              id: "title",
              textColor: $color("#333333"),
              bgolor: $color("#fdf6e5"),
              lines: 2
            },
            layout: function(make) {
              make.left.inset(20)
              make.right.inset(35)
              make.top.bottom.inset(0)
            }
          }]
        },
        layout: function(make) {
          make.top.equalTo($("line").bottom)
          make.bottom.left.right.inset(0)
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            selectChapter = indexPath.row;
            getChapterContent(selectChapter)

          }
        }
      },
      {
        type: "slider",
        props: {
          id: "goto",
          minColor: $color("#008080"),
          bgcolor:$color("clear")
        },
        layout: function(make, view) {
          make.right.inset(-80)
          make.width.equalTo(200)
          make.height.equalTo(30)
          make.centerY.equalTo(view.super)
        },
        events: {
          changed(sender) {
            var max = $("chapterList").contentSize.height - 565;
            $("chapterList").contentOffset = $point(0, sender.value * max)
          }
        }
      }
    ]
  });
  $("goto").rotate(1.57);
}

// 获取小说源
function getBookSource(bookid) {
  selectBookId = bookid;
  $http.get({
    url: "http://api.zhuishushenqi.com/toc?view=summary&book=" + bookid,
    handler: function(resp) {
      bookSourceId = resp.data.map(function(i) {
        return i._id
      });
      bookSourceName = resp.data.map(function(i) {
        return i.name
      });
      getBookChapter()
    }
  })
}

//获取小说章节
function getBookChapter(sourceid) {
  var res = casebook()
  if (sourceid) {
    var id = sourceid
  } else {
    if (res && res[1]) {
      var id = res[1].source
    } else {
      var id = bookSourceId[1] || bookSourceId[0]
    }
  }
  selectSource = id;
  $http.get({
    url: "http://api.zhuishushenqi.com/toc/" + id + "?view=chapters",
    header: Header,
    handler: function(resp) {
      if (resp.data.name == "优质书源") {
        $("sourceName").text = "当前书源：" + resp.data.name + "［追书收费源］";
        $ui.toast("当前源为追书神器官方收费源,无法获取内容");
      } else {
        $("sourceName").text = "   当前书源：" + resp.data.name;
      }
      bookChapterData = resp.data.chapters;
      var data = [];
      resp.data.chapters.map(function(i) {
        data.push({
          title: {
            text: i.title
          }
        })
      });
      $("chapterList").data = data;
      if (res && res[1]) {
        getChapterContent(res[1].chapter)
      }
    }
  })
}

//获取章节内容
function getChapterContent(row, mode) {
  var link = row ? bookChapterData[row].link : bookChapterData[0].link;
  var title = row ? bookChapterData[row].title : bookChapterData[0].title;
  var time = Math.round(new Date().getTime() / 1000) + 7200;
  $http.get({
    url: "http://chapterup01.zhuishushenqi.com/chapter/" + $text.URLEncode(link) + "?t=" + time,
    header: Header,
    handler: function(resp) {
      var chapter = formatContent(resp.data.chapter.body);
      var res = casebook();
      if (typeof(selectChapter) == "undefined") {
        selectChapter = res[1].chapter;
      }
      selectPage = res[1] && selectChapter == res[1].chapter ? res[1].page : 0;
      html = template.replace("{{TITLE}}", title).replace("{{CONTENT}}", chapter).replace("{{PAGE}}", selectPage);
      if (!mode) {
        reader()
      };
      $("reader").html = html

    }
  })
}

//章节内容格式化
function formatContent(str) {
  var list = str.split("\n")
  list = list.map(function(i) {
    return "&#12288;&#12288" + i + "<br/>"
  })
  return list.join("")
}

// 书架内小说更新检测
function bookCaseUpdateCheck() {
  if (bcData.length > 0) {
    var ids = bcIds.join(",")
    $http.get({
      url: "http://api.zhuishushenqi.com/book?view=updated&id=" + ids,
      handler: function(resp) {
        resp.data.map(function(item) {
          var idx = bcIds.indexOf(item._id);
          var old = bcData[idx].updated;
          var msg = timeCalc(old,
            item.updated);
          if (msg[0]) {
            bcData[idx].updated = item.updated;
            bcData[idx].lastChapter = item.lastChapter;
            bcData[idx].msg = msg[1];
            updated.push(item._id);
          }
        });
        if (updated.length > 0) {
          cacheWrite()
          loadBookCaseData()
          $ui.toast(updated.length + "本小说有更新", 1)
        } else {
          $ui.toast("无更新", 1)
        }
      }
    })
  }
}

// 书架内小说更新时间格式化
function timeCalc(old, now) {
  var oldtime = new Date(old.replace(/T/g, " ").replace(/\.\d{3}Z/, "").replace(/-/g, "/")).getTime() / 1000
  var nowtime = new Date(now.replace(/T/g, " ").replace(/\.\d{3}Z/, "").replace(/-/g, "/")).getTime() / 1000
  if (nowtime > oldtime) {
    var msg;
    var t = nowtime - oldtime;
    if (60 * 60 > t) {
      msg = Math.ceil(t / 60) + "分钟前有更新"
    } else if (60 * 60 * 24 > t > 60 * 60) {
      msg = Math.ceil(t / 60 / 60) + "小时前有更新"
    } else {
      msg = Math.ceil(t / 60 / 60 / 24) + "天前有更新"
    }
    return [true, msg]
  } else {
    return [false]
  }
}

//判断小说是否在书架并返回数据
function casebook(bookid) {
  var id = bookid || selectBookId;
  var index = bcIds.indexOf(id);
  if (index > -1) {
    var data = bcData[index];
    return data.log ? [data, data.log] : data
  } else {
    return false
  }
}

//本地书架小说阅读记录写入
function logWrite() {
  var index = bcIds.indexOf(selectBookId);
  if (index > -1) {
    bcData[index].log = {
      "source": selectSource,
      "chapter": selectChapter,
      "page": selectPage
    };
    cacheWrite()
  }
}

//内存数据写入
function cacheWrite() {
  $file.write({
    data: $data({
      string: JSON.stringify(bcData)
    }),
    path: ConfigPath
  })
}

// 本地书架数据写入
function bcDataWrite(bookid, mode, row) {
  var index = bcIds.indexOf(bookid)
  if (mode == "add") {
    if (index > -1) {
      $ui.toast("《" + bcData[index].title + "》已在书架中", 0.5)
      return
    };
    var data = JSON.parse($http.sync("http://api.zhuishushenqi.com/book/" + bookid))
    var item = {
      bookid: data._id,
      bookname: data.title,
      bookCaseDetail: {
        info: data._id
      },
      cover: { src: encodeURI("http://statics.zhuishushenqi.com" + $text.URLDecode(data.cover)) },
      title: { text: data.title },
      lastChapter: {
        text: data.lastChapter
      }
    }
    $("bcList").insert({
      indexPath: $indexPath(0, bcData.length),
      value: item
    })

    bcData.push(data);
    bcIds.push(bookid);
    $ui.toast("已收藏《" + data.title + "》", 0.5);

  } else if (mode == "del") {
    $("bcList").delete(row)
    $ui.toast("已删除《" + bcData[index].title + "》", 0.5);
    bcIds.splice(index, 1);
    bcData.splice(index, 1);
  }
  cacheWrite()
  $("bookCaseCount").text =
    bcData.length > 0 ? "   已收藏" + bcData.length + "本书" : "   ➕请搜索添加小说";
}

// 加载本地缓存数据
function loadBookCaseData() {
  $("bookCaseCount").text =
    bcData.length > 0 ? "   已收藏" + bcData.length + "本书" : "   ➕请搜索添加小说";
  if (bcData.length > 0) {
    var data = [];
    bcData.map(function(item) {
      data.push({
        bookid: item._id,
        bookname: item.title,
        bookCaseDetail: {
          info: item._id
        },
        cover: {
          src: encodeURI(
            "http://statics.zhuishushenqi.com" + $text.URLDecode(item.cover)
          )
        },
        title: {
          text: item.title
        },
        lastChapter: {
          text: updated.indexOf(item._id) < 0 ? item.lastChapter : item.msg,
          textColor: updated.indexOf(item._id) < 0 ? $color("#008080") : $color("#ff00d9")
        },
      })
    });
    $console.info(JSON.stringify(data))
    $("bcList").data = data
  }
}

// 启动
function main() {
  $file.mkdir("drive://ebook");
  updated = [];
  if (!$file.read(ConfigPath)) {
    bcData = [];
    bcIds = [];
  } else {
    bcData = JSON.parse($file.read(ConfigPath).string)
    bcIds = bcData.map(function(i) {
      return i._id
    })
  }
  loadBookCaseData()
  $thread.background({
    handler: function() {
      bookCaseUpdateCheck()
    }
  })
}

// 数据缓存路径
var ConfigPath = "drive://ebook/books.json"
// 请求UA
var Header = {
  "User-Agent": "YouShaQi/2.25.1 (iPhone; iOS 10.3.1; Scale/2.00)",
  "X-User-Agent": "YouShaQi/2.25.1 (iPhone; iOS 10.3.1; Scale/2.00)"
}

$thread.background({
  handler: function() {
    main()
  }
})