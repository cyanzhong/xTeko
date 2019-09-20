let userViews = {
  type: "view",
  props: {
    id: "userContent",
    hidden: false,
    bgcolor: $color("#fffae1")
  },
  layout: $layout.fill,
  views: [{
    type: "text",
    props: {
      id: "userTitle",
      bgcolor: $rgba(165, 210, 150, 0.3),
      textColor: $color("#71226e"),
      selectable: false,
      scrollEnabled: false,
      insets: $insets(5, 5, 5, 5)
    },
    layout: function(make) {
      make.top.left.right.inset(0)
      make.height.equalTo(30)
    }
  }, {
    type: "button",
    props: {
      id: "back",
      title: "返回",
      hidden: true,
      bgcolor: $color("clear"),
      titleColor: $color("#006400")
    },
    layout: function(make, view) {
      make.top.inset(0)
      make.height.equalTo(30)
      make.left.inset(5)
      make.width.equalTo(40)
    },
    events: {
      tapped(sender) {
        $device.taptic(0)
        loadLocalUserData()
      }
    }
  }, {
    type: "list",
    props: {
      id: "userList",
      rowHeight: 90,
      bgcolor: $color("#fffae1"),
      //separatorHidden: true,
      header: {
        type: "view",
        props: {
          height: 45,
          bgcolor: $rgba(165, 210, 150, 0.3)
        },
        views: [{
          type: "input",
          props: {
            id: "keyword",
            clearsOnBeginEditing: true,
            bgcolor: $color("#fffff5"),
            textColor: $color("#71226e"),
            radius: 5
          },
          layout: function(make) {
            make.top.bottom.left.inset(5)
            make.right.inset(80)
          },
          events: {
            returned(sender) {
              sender.blur();
              $device.taptic(0);
              if (sender.text.length) {
                homePageMode = "search";
                search(sender.text)
              } else {
                sender.text = "Search..."
              }
            }
          }
        }, {
          type: "button",
          props: {
            id: "quickImport",
            title: "导入",
            titleColor: $color("white"),
            bgcolor: $color("#77af9c"),
            borderColor: $color("#598987"),
            borderWidth: 0
          },
          layout: function(make) {
            make.top.bottom.right.inset(6)
            make.left.equalTo($("keyword").right).offset(10)
          },
          events: {
            tapped(sender) {
              $device.taptic(0)
              quickImport($clipboard.link)
            }
          }
        }]
      },
      template: [{
          type: "view",
          props: {
            bgcolor: $color("#fffae1")
          },
          layout: $layout.fill
        }, {
          type: "image",
          props: {
            id: "casecover",
            radius: 30,
            borderWidth: 1,
            borderColor: $color("#ff1493")
          },
          layout: function(make, view) {
            make.left.inset(15)
            make.top.bottom.inset(15)
            make.width.equalTo(view.height)
          }
        }, {
          type: "label",
          props: {
            id: "casefullname",
            font: $font("AppleSDGothicNeo-Bold", 18)
          },
          layout: function(make, view) {
            make.left.equalTo($("casecover").right).offset(15)
            make.top.inset(13)
            make.height.equalTo(22)
            make.right.inset(55)
          }
        }, {
          type: "label",
          props: {
            id: "caseusername",
            textColor: $color("#777c7c"),
            font: $font(12)
          },
          layout: function(make, view) {
            make.left.equalTo($("casecover").right).offset(15)
            make.top.equalTo($("casefullname").bottom)
            make.height.equalTo(16)
            make.right.inset(50)
          }
        }, {
          type: "label",
          props: {
            id: "caselike",
            textColor: $color("white"),
            font: $font(11),
            radius: 3
          },
          layout: function(make, view) {
            make.left.equalTo($("casecover").right).offset(15)
            make.top.equalTo($("caseusername").bottom).offset(5)
            make.bottom.inset(15)
            make.width.equalTo(60)
          }
        },
        {
          type: "label",
          props: {
            id: "caseprivate",
            textColor: $color("white"),
            font: $font(11),
            radius: 3
          },
          layout: function(make) {
            make.left.equalTo($("caselike").right).offset(5)
            make.top.equalTo($("caseusername").bottom).offset(5)
            make.bottom.inset(15)
          }

        }, {
          type: "label",
          props: {
            id: "caseverified",
            textColor: $color("white"),
            font: $font(11),
            radius: 3
          },
          layout: function(make) {
            make.left.equalTo($("caseprivate").right).offset(5)
            make.top.equalTo($("caseusername").bottom).offset(5)
            make.bottom.inset(15)
          }

        },
        {
          type: "button",
          props: {
            id: "caseadd",
            title: "🔘",
            bgcolor: $color("clear")
          },
          layout: function(make, view) {
            make.top.bottom.inset(20)
            make.right.inset(5)
            make.width.equalTo(view.height)
          },
          events: {
            tapped(sender) {
              $device.taptic(0);
              if (sender.info[0].is_private) {
                $ui.toast("❌ 不支持浏览私密账户")
              } else {
                updateLocalUserData("add", sender.info[0]);
                var data = $("userList").data;
                data[sender.info[1]].caseadd.alpha = 0.3;
                $("userList").data = data
              }
            }
          }
        }
      ],
      actions: [{
        title: "delete",
        handler: function(sender, indexPath) {
          if (homePageMode == "user") {
            $device.taptic(0)
            updateLocalUserData("del", indexPath.row)
          }
        }
      }, {
        title: "分享",
        handler: function(sender, indexPath) {
          $device.taptic(0);
          var username = $("list").data[indexPath.row].caseusername.text;
          $share.sheet("https://www.instagram.com/" + username)
        }
      }],
    },
    layout: function(make) {
      make.top.equalTo($("userTitle").bottom)
      make.left.right.bottom.inset(0)
    },
    events: {
      didSelect: function(sender, indexPath, data) {
        var title = data.info.fullname || (data.info.full_name || data.info.username);
        userHomePageView(title);
        getUserHomePageJson("https://www.instagram.com/" + data.info.username)
      }
    }
  }]
}

let postViews = {
  type: "view",
  props: {
    id: "postContent",
    hidden: true,
    bgcolor: $color("#fffae1")
  },
  layout: $layout.fill,
  views: [{
      type: "label",
      props: {
        id: "postTitle",
        bgcolor: $rgba(165, 210, 150, 0.3),
        textColor: $color("#71226e"),
      },
      layout: function(make) {
        make.left.top.right.inset(0)
        make.height.equalTo(30)
      }
    },
    {
      type: "list",
      props: {
        id: "postList",
        rowHeight: $device.info.screen.width,
        bgcolor: $color("#fdf6e5"),
        actions: [{
          title: "delete",
          handler: function(sender, indexPath) {
            updateLocalPostData("del", indexPath.row)
          }
        }],
        template: [{
          type: "image",
          props: {
            id: "postCover"
          },
          layout: $layout.fill
        }, {
          type: "label",
          props: {
            id: "postInfo",
            bgcolor: $rgba(165, 210, 150, 0.6),
            textColor: $color("#71226e"),
            align: $align.center,
            font: $font(14),
            autoFontSize: true
          },
          layout: function(make) {
            make.left.right.bottom.inset(0)
            make.height.equalTo(30)
          }
        }]
      },
      layout: function(make) {
        make.top.equalTo($("postTitle").bottom)
        make.left.right.bottom.inset(0)
      },
      events: {
        didSelect: function(sender, indexPath, data) {
          $ui.toast("加载中...", 100);
          getPostMediaUrls(data.info.code)
        },
      }
    }

  ]
}

//根视图
$ui.render({
  props: {
    id: "rootView",
    title: "Instagram Lite",
    iconColor: $color("#006400"),
    titleColor: $color("#006400"),
    barColor: $color("#fff1b9")
  },
  views: [{
    type: "menu",
    props: {
      id: "menu",
      bgcolor: $color("#fff1b9"),
      items: ["关注列表", "收藏列表"]
    },
    layout: function(make) {
      make.left.right.bottom.inset(0)
      make.height.equalTo(43)
    },
    events: {
      changed(sender) {
        if (sender.index == 1) {
          homePageMode = "post";
          $("postContent").hidden = false;
          $("userContent").hidden = true;
          loadLocalPostData()
        } else if (sender.index == 0) {
          homePageMode = "user";
          $("postContent").hidden = true;
          $("userContent").hidden = false
        }
      }
    }
  }, {
    type: "view",
    props: {
      id: "line",
      bgcolor: $color("#8b8687")
    },
    layout: function(make) {
      make.bottom.equalTo($("menu").top)
      make.left.right.inset(0)
      make.height.equalTo(0.5)
    }
  }, {
    type: "view",
    layout: function(make) {
      make.top.left.right.equalTo(0)
      make.bottom.equalTo($("line").top)
    },
    views: [userViews, postViews]
  }]
})

function userHomePageView(name) {
  $ui.push({
    props: {
      title: name,
    },
    views: [{
      type: "matrix",
      props: {
        id: "show",
        columns: 2,
        spacing: 1,
        square: true,
        bgcolor: $color("#fffae1"),
        template: [{
            type: "image",
            props: {
              id: "cover",
            },
            layout: $layout.fill
          },
          {
            type: "label",
            props: {
              id: "detail",
              font: $font(12),
              align: $align.center,
              textColor: $color("#71226e"),
              bgcolor: $rgba(165, 210, 150, 0.6),
              autoFontSize: true
            },
            layout: function(make, view) {
              make.left.right.bottom.inset(0)
              make.height.equalTo(20)
            }
          },
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect: function(sender, indexPath, data) {
          $ui.toast("加载中...", 100);
          getPostMediaUrls(data.info.code)
        },
        didReachBottom(sender) {
          if (!NextPage) {
            $device.taptic(0);
            sender.endFetchingMore();
          } else {
            $ui.toast("加载中...", 100)
            $thread.background({
              handler: function() {
                getShortCode();
              }
            });
          }
        }
      }
    }]
  })
}

function postDetailView(code, scale) {
  selectCode = code;
  var data = mediaData[code];
  var items = [];
  for (idx in data.media) {
    var i = data.media[idx];
    if (i.video) {
      items.push({
        type: "video",
        props: {
          info: "video",
          src: i.video,
          poster: i.image
        }
      })
    } else {
      items.push({
        type: "image",
        props: {
          info: "image",
          src: i.image
        }
      })
    };
  };
  $ui.push({
    type: "view",
    props: {
      title: "Post Detail View",
    },
    views: [{
      type: "list",
      layout: $layout.fill,
      events: {
        rowHeight: function(sender, indexPath) {
          if (indexPath.row == 0) {
            return 375 / scale
          } else if (indexPath.row == 1) {
            return 60
          } else if (indexPath.row == 2) {
            return 200
          }
        }
      },
      props: {
        id: "content",
        bgcolor: $color("#fffae1"),
        showsVerticalIndicator: false,
        data: [{
            rows: [{
              type: "view",
              layout: $layout.fill,
              views: [{
                type: "gallery",
                props: {
                  id: "detail",
                  items: items,
                  bgcolor: $color("#fffae1")
                },
                layout: $layout.fill
              }, {
                type: "view",
                props: {
                  bgcolor: $color("clear")
                },
                layout: function(make) {
                  make.top.left.bottom.inset(0)
                  make.width.equalTo(20)
                }
              }]
            }, {
              type: "view",
              layout: $layout.fill,
              props: {
                bgcolor: $color("#fffae1")
              },
              views: [{
                type: "button",
                props: {
                  id: "usercover",
                  src: userCover,
                  radius: 25,
                  borderColor: $color("#008000"),
                  borderWidth: 1
                },
                layout: function(make) {
                  make.top.bottom.inset(5)
                  make.left.inset(15)
                  make.height.width.equalTo(50)
                },
                events: {
                  tapped(sender) {
                    $device.taptic(0);
                    if (homePageMode == "post") {
                      $ui.pop();
                      userHomePageView(userFullName || userName);
                      getUserHomePageJson("https://www.instagram.com/" + userName)
                    } else {
                      $ui.pop()
                    }

                  }
                }
              }, {
                type: "label",
                props: {
                  id: "username",
                  font: $font("bold", 13),
                  text: userName,
                  textColor: $color("#71226e"),
                  autoFontSize: true
                },
                layout: function(make) {
                  make.top.inset(5)
                  make.height.equalTo(20)
                  make.left.equalTo($("usercover").right).offset(10)
                  make.right.inset(10)
                }
              }, {
                type: "label",
                props: {
                  id: "count",
                  font: $font(12),
                  text: formatTime(data.postDate) + "\n" + data.likes + " 人点赞   " + data.comment + " 人评论",
                  lines: 2,
                  autoFontSize: true
                },
                layout: function(make, view) {
                  make.top.equalTo($("username").bottom)
                  make.left.equalTo($("username").left)
                  make.right.inset(10)
                  make.bottom.inset(5)
                }
              }, {
                type: "button",
                props: {
                  id: "favorite",
                  title: "♥️",
                  alpha: 0.8,
                  bgcolor: LocalPostCode.indexOf(code) < 0 ? $color("#eeeeed") : $color("#4caf50")
                },
                layout: function(make, view) {
                  make.top.bottom.right.inset(10)
                  make.width.equalTo(view.height)
                },
                events: {
                  tapped(sender) {
                    $device.taptic(0);
                    var index = LocalPostCode.indexOf(code);
                    if (index < 0) {
                      sender.bgcolor = $color("#4caf50");
                      updateLocalPostData("add", code, true)
                    } else {
                      sender.bgcolor = $color("#eeeeed");
                      updateLocalPostData("del", index, true)
                    }
                  }
                }
              }]
            }, {
              type: "view",
              layout: $layout.fill,
              props: {
                bgcolor: $color("#fffae1")
              },
              views: [{
                type: "button",
                props: {
                  id: "trans",
                  title: "显示译文",
                  bgcolor: $color("clear"),
                  font: $font(14),
                  titleColor: $color("#000091"),
                  hidden: data.caption ? false : true
                },
                layout: function(make) {
                  make.top.inset(5)
                  make.left.inset(12)
                  make.width.equalTo(60)
                  make.height.equalTo(20)
                },
                events: {
                  tapped(sender) {
                    $device.taptic(0)
                    if (sender.title == "显示译文") {
                      Trans($("caption").text)
                    } else if (sender.title == "显示原文") {
                      $("caption").text = mediaData[code]["caption"];
                      sender.title = "显示译文"
                    }
                  }
                }
              }, {
                type: "text",
                props: {
                  id: "caption",
                  text: data.caption,
                  font: $font(14),
                  textColor: $color("#777c7c"),
                  bgcolor: $color("clear"),
                  radius: 0,
                  showsVerticalIndicator: false,
                  editable: false,
                  alwaysBounceVertical: false
                },
                layout: function(make, view) {
                  make.top.equalTo($("trans").bottom)
                  make.bottom.left.right.inset(5)
                }
              }]
            }]
          }

        ]
      }

    }, {
      type: "button",
      props: {
        id: "save",
        title: "保存文件",
        bgcolor: $color("#fff1b9"),
        titleColor: $color("#006400"),
        alpha: 0.9,
        font: $font("bold", 18),
        radius: 0,
      },
      layout: function(make, view) {
        make.left.bottom.inset(0)
        make.height.equalTo(43)
        make.width.equalTo(view.super).dividedBy(3)
      },
      events: {
        tapped(sender) {
          var id = "__item__" + $("detail").page;
          var type = $(id).info;
          if (type == "video") {
            mediaSaveAction("video")
          } else {
            mediaSaveAction("saveImage")
          }
        }
      }

    }, {
      type: "button",
      props: {
        id: "share",
        title: "分享文件",
        bgcolor: $color("#fff1b9"),
        titleColor: $color("#006400"),
        alpha: 0.9,
        font: $font("bold", 18),
        radius: 0,
      },
      layout: function(make, view) {
        make.bottom.inset(0)
        make.left.equalTo($("save").right)
        make.height.equalTo(43)
        make.width.equalTo(view.super).dividedBy(3)
      },
      events: {
        tapped(sender) {
          $device.taptic(0);
          var id = "__item__" + $("detail").page;
          var type = $(id).info;
          if (type == "video") {
            mediaSaveAction("video")
          } else {
            mediaSaveAction("shareImage")
          }
        }
      }

    }, {
      type: "button",
      props: {
        id: "link",
        title: "分享链接",
        bgcolor: $color("#fff1b9"),
        titleColor: $color("#006400"),
        alpha: 0.9,
        font: $font("bold", 18),
        radius: 0,
      },
      layout: function(make, view) {
        make.right.bottom.inset(0)
        make.height.equalTo(43)
        make.width.equalTo(view.super).dividedBy(3)
      },
      events: {
        tapped(sender) {
          mediaSaveAction("link")
        }
      }
    }, {
      type: "progress",
      props: {
        id: "progress",
        value: 0,
        trackColor: $color("clear"),
        alpha: 0.9,
        progressColor: $color("#e71d36"),
        userInteractionEnabled: false
      },
      layout: function(make, view) {
        make.bottom.left.right.inset(0)
        make.height.equalTo(43)
      }
    }]

  })
  $ui.toast("✅ 加载完成", 0.1)
}

function getUserHomePageJson(input, mode) {
  $ui.toast("加载中...", 100);
  $http.get({
    header: Header,
    url: input,
    handler: function(resp) {
      var match = /window\.\_sharedData\s=\s.+?(?=\;\<\/script\>)/g.exec(resp.data)[0].replace("window._sharedData = ", "");
      homePageJson = JSON.parse(match).entry_data.ProfilePage[0].user;
      if (homePageJson.is_private) {
        $ui.toast("❌ 暂不支持浏览私密账户", 1);
        $ui.pop();
        return;
      };
      if (mode == "import") {
        homePageMode = "user";
        updateLocalUserData("add", homePageJson)
      } else {
        postDataFormat(homePageJson, "home")
      }
    }
  })
}

function search(keyword) {
  $ui.toast("搜索中...", 100);
  homePageMode = "search";
  $http.get({
    url: "https://www.instagram.com/web/search/topsearch/?context=blended&query=" + $text.URLEncode(keyword),
    handler: function(resp) {
      var data = [];
      for (idx in resp.data.users) {
        var i = resp.data.users[idx];
        data.push({
          info: i.user,
          casecover: {
            src: i.user.profile_pic_url
          },
          casefullname: {
            text: i.user.full_name || i.user.username,
            textColor: $color("#274555")
          },
          caseusername: {
            text: i.user.username
          },
          caselike: {
            text: likedCountFormat(i.user.follower_count),
            bgcolor: $rgba(250, 0, 0, 0.4),
          },
          caseprivate: {
            text: i.user.is_private ? " 私密账户 " : " 公开账户 ",
            bgcolor: i.user.is_private ? $color("#8e8e8e") : $rgba(32, 92, 85, 0.6)
          },
          caseverified: {
            text: i.user.is_verified ? " 官方认证 " : " 未经认证 ",
            bgcolor: i.user.is_verified ? $rgba(113, 18, 110, 0.6) : $color("#8e8e8e")
          },
          caseadd: {
            info: [i.user, idx],
            hidden: false,
            alpha: i.user.is_private || LocalUserName.indexOf(i.user.username) > -1 ? 0.3 : 1
          }
        })
      };
      $ui.toast("✅ 完成", 0.1);
      $("userList").data = data;
      $("userTitle").align = $align.right;
      $("back").hidden = false;
      $("userTitle").text = "  搜索到" + data.length + "条相关结果"
    }
  })
}

function formatTime(ns) {
  return new Date(parseInt(ns) * 1000).toLocaleString().replace(/:\d{1,2}$/, "").replace(/\//g, "-")
}

function getShortCode() {
  var queryvar = {
    "id": userID,
    "after": AfterID,
    "first": 36
  };
  var url = "https://www.instagram.com/graphql/query/?query_id=17888483320059182&variables=" + encodeURI(JSON.stringify(queryvar));
  $http.get({
    header: Header,
    url: url,
    handler: function(resp) {
      postDataFormat(resp.data, "continue")
    }
  })
}

function postDataFormat(resdata, mode) {
  if (mode == "home") {
    userName = resdata.username;
    userID = resdata.id;
    userFullName = resdata.full_name;
    userCover = resdata.profile_pic_url;
    userFollowed = resdata.followed_by.count;
    userPosted = resdata.media.count;
    AfterID = resdata.media.page_info.end_cursor;
    NextPage = resdata.media.page_info.has_next_page;
    var media = resdata.media.nodes;
    shortCodeTask = [];
    media.map(function(i) {
      shortCodes.push(i.code);
      shortCodeTask.push(i.code);
      mediaData[i.code] = {

        "code": i.code,
        "postDate": i.date,
        "thumbnail": i.thumbnail_src,
        "comment": i.comments.count,
        "likes": i.likes.count,
        "type": i.__typename
      };
    });
    var idx = LocalUserName.indexOf(userName);
    if (idx > -1) {
      updateLocalUserData("update", resdata)
    }
  } else if (mode = "continue") {
    AfterID = resdata.data.user.edge_owner_to_timeline_media.page_info.end_cursor;
    NextPage = resdata.data.user.edge_owner_to_timeline_media.page_info.has_next_page;
    var media = resdata.data.user.edge_owner_to_timeline_media.edges;
    shortCodeTask = [];
    media.map(function(i) {
      var item = i.node
      shortCodes.push(item.shortcode);
      shortCodeTask.push(item.shortcode);
      mediaData[item.shortcode] = {
        "code": item.shortcode,
        "postDate": item.taken_at_timestamp,
        "thumbnail": item.thumbnail_src,
        "comment": item.edge_media_to_comment.count,
        "likes": item.edge_media_preview_like.count,
        "type": item.__typename
      };
    });
  }
  userHomePageDataPush()
}

function getPostMediaUrls(code) {
  $http.get({
    header: Header,
    url: "https://www.instagram.com/p/" + code + "/?__a=1",
    handler: function(resp) {
      var res = resp.data.graphql.shortcode_media;
      if (!mediaData[code]) {
        mediaData[code] = {};
        mediaData[code]["comment"] = res.edge_media_to_comment.count;
        mediaData[code]["postDate"] = res.taken_at_timestamp;
        mediaData[code]["likes"] = res.edge_media_preview_like.count;
        userName = res.owner.username;
        userCover = res.owner.profile_pic_url;
        userFullName = res.owner.full_name;
      };
      mediaData[code]["caption"] = res.edge_media_to_caption.edges[0] ? res.edge_media_to_caption.edges[0].node.text : "";
      var items = [];
      if (res.edge_sidecar_to_children) {
        var json = res.edge_sidecar_to_children.edges;
        var imageSize = json[0].node.dimensions;
        json.map(function(i) {
          var video = i.node.is_video ? i.node.video_url : false;
          var image = i.node.display_url;
          items.push({
            "video": video,
            "image": image
          })
        });
      } else {
        var json = resp.data.graphql.shortcode_media;
        var imageSize = json.dimensions;
        var video = json.is_video ? json.video_url : false;
        var image = json.display_url;
        items.push({
          "video": video,
          "image": image
        })
      };
      mediaData[code]["media"] = items;
      var scale = imageSize.width / imageSize.height;
      postDetailView(code, scale)
    }
  })
}

function Trans(keyword) {
  var url = "https://translate.google.cn/translate_a/single?client=it&dt=t&dt=rmt&dt=bd&dt=rms&dt=qca&dt=ss&dt=md&dt=ld&dt=ex&otf=3&dj=1&hl=zh_CN&ie=UTF-8&oe=UTF-8&sl=auto&tl=zh-CN&q=" + $text.URLEncode(keyword);
  $http.get({
    header: {
      "User-Agent": "GoogleTranslate/5.8.58002 (iPhone; iOS 10.3; zh_CN; iPhone8,1)"
    },
    url: url,
    handler: function(resp) {
      var json = resp.data.sentences;
      var count = json.length;
      var text = json.splice(0, count - 1).map(function(i) {
        return i.trans
      });

      $("caption").text = text.join("");
      $("trans").title = "显示原文"
    }
  })
}

function mediaSaveAction(mode) {
  $device.taptic(0);
  var id = "__item__" + $("detail").page;
  var json = mediaData[selectCode]["media"][$("detail").page];
  switch (mode) {
    case "link":
      $share.sheet("https://www.instagram.com/p/" + selectCode);
      break;
    case "video":
      if ($("progress").value > 0) {
        $ui.toast("⏳ 请等待上一个任务下载完成", 1)
      } else {
        $http.download({
          header: Header,
          url: json.video,
          progress: function(bytesWritten, totalBytes) {
            var num = bytesWritten * 1.0 / totalBytes;
            $("progress").value = num
          },
          handler: function(resp) {
            $("progress").value = 0;
            $share.sheet(resp.data)
          }
        })
      };
      break;
    case "saveImage":
      if ($(id).image) {
        $photo.save({
          image: $(id).image
        });
        $ui.toast("✅ 已保存到相册", 1)
      } else {
        $ui.toast("⏳ 请等待图片加载完成", 1);
      };
      break;
    case "shareImage":
      if ($(id).image) {
        $share.universal($(id).image)
      } else {
        $ui.toast("⏳ 请等待图片加载完成", 1);
      };
      break;
  }
}

function likedCountFormat(num) {
  if (num < 10000) {
    return " ♥ " + num;
  } else if (num === 10000) {
    return " ♥ " + num / 1000 + "k ";
  } else if (num > 10000 && num < 1000000) {
    return " ♥ " + (num / 1000).toFixed(1) + "k ";
  } else if (num === 1000000) {
    return " ♥ " + num / 1000000 + "m ";

  } else if (num > 1000000) {
    return " ♥ " + (num / 1000000).toFixed(1) + "m ";
  }
}

function quickImport(input) {
  var match = /^http.+?instagram.com\/[^\/]+?\/?$/g.exec(input);
  if (!match) {
    $ui.toast("❌ 剪贴板地址非用户主页地址", 1);
    return;
  } else {
    getUserHomePageJson(input, "import")

  }
}

function updateLocalUserData(mode, data) {
  if (mode == "update") {
    $thread.background({
      handler: function() {
        var idx = LocalUserName.indexOf(userName);
        LocalData.user[idx] = {
          "username": data.username,
          "fullname": data.full_name,
          "cover": data.profile_pic_url,
          "liked": data.follower_count || data.followed_by.count,
          "private": data.is_private,
          "verified": data.is_verified
        };
        loadLocalUserData()
      }
    })
  } else if (mode == "add") {
    if (LocalUserName.indexOf(data.username) > -1) {
      $ui.toast("❗️" + data.username + "已在关注列表中", 1);
      return;
    }
    LocalUserName.push(data.username);
    LocalData.user.push({
      "username": data.username,
      "fullname": data.full_name,
      "cover": data.profile_pic_url,
      "liked": data.follower_count || data.followed_by.count,
      "private": data.is_private,
      "verified": data.is_verified
    });
    $ui.toast("✅ 已关注 " + data.username, 1);
    if (homePageMode == "user") {
      loadLocalUserData()
    };
  } else if (mode == "del") {
    LocalData.user.splice(data, 1);
    $ui.toast("✅ 已取消对 " + LocalUserName[data] + " 的关注", 1);
    LocalUserName.splice(data, 1);
    $("userTitle").text = "已关注" + LocalUserName.length + "位用户"
  };
  $drive.write({
    data: $data({
      string: JSON.stringify(LocalData)
    }),
    path: config
  });
}

function updateLocalPostData(mode, code, x) {
  if (mode == "add") {
    var data = mediaData[code];
    LocalPostCode.push(data.code)
    LocalData.post.push({
      "username": userName,
      "code": data.code,
      "postDate": data.postDate,
      "thumbnail": data.thumbnail
    });
    $ui.toast("✅ 已收藏", 0.5);
  } else if (mode == "del") {
    LocalPostCode.splice(code, 1);
    LocalData.post.splice(code, 1);
    $ui.toast("✅ 已取消收藏", 0.5)
    if (x) {
      $("postList").delete(code)
    }
  }
  $drive.write({
    data: $data({
      string: JSON.stringify(LocalData)
    }),
    path: config
  });
  loadLocalPostData()
}

function userHomePageDataPush() {
  var data = [];
  shortCodeTask.map(function(i) {
    var item = mediaData[i];
    if (item.type == "GraphImage") {
      var type = "image"
    } else if (item.type == "GraphVideo") {
      var type = "video"
    } else {
      var type = "gallery"
    };
    data.push({
      info: item,
      cover: { src: item.thumbnail },
      detail: {
        text: "♥ " + item.likes + "   " + type
      }
    })
  });
  $("show").endFetchingMore();
  $("show").data = $("show").data.concat(data);
  $ui.toast("✅ 加载完成 (" + $("show").data.length + "/" + userPosted + ")", 0.6);
}

function loadLocalPostData() {
  LocalPostCode = [];
  var data = [];
  LocalData.post.map(function(i) {
    LocalPostCode.push(i.code)
    data.push({
      info: i,
      postCover: {
        src: i.thumbnail
      },
      postInfo: {
        text: i.username + "   发表于" + formatTime(i.postDate)
      }
    })
  });
  $("postList").data = data;
  $("postTitle").text = "  已收藏" + data.length + "条帖子";
}

function loadLocalUserData() {
  homePageMode = "user";
  $("back").hidden = true;
  $("userTitle").align = $align.left;
  LocalUserName = [];
  var data = [];
  LocalData.user.map(function(i) {
    LocalUserName.push(i.username)
    data.push({
      info: i,
      casecover: {
        src: i.cover
      },
      casefullname: {
        text: i.fullname || i.username,
        textColor: i.verified ? $color("#600473") : $color("#118077")
      },
      caseusername: {
        text: i.username
      },
      caselike: {
        text: likedCountFormat(i.liked) + " ",
        bgcolor: $rgba(91, 96, 73, 0.6)
      },
      caseprivate: {
        text: ""
      },
      caseverified: {
        text: ""
      },
      caseadd: {
        hidden: true
      }
    })
  })
  $("userList").data = data;
  $("userTitle").text = "已关注" + data.length + "位用户";
  $("keyword").text = "Search..."

}

function main() {
  var file = $drive.read(config);
  if (file) {
    LocalData = JSON.parse(file.string);
  } else {
    LocalData = { "user": [], "post": [] };
  }
  loadLocalUserData();
  loadLocalPostData()
}

var Header = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
  'Orgin': 'https://www.instagram.com/',
  'Referer': 'https://www.instagram.com/'
};

var config = ".instagram-lite.json";
var shortCodes = [],
  mediaData = {};
$thread.background({
  handler: function() {
    main()
  }
})