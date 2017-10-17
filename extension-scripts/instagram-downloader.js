$ui.render({
  views: [{
      type: "label",
      props: {
        id: "input",
        align: $align.center,
        frame: $rect(0, 0, 375, 45),
        lines: 0
      }
    },
    {
      type: "label",
      props: {
        id: "username",
        text: "未知",
        textColor: $color("magenta"),
        font: $font("bold", 26),
        align: $align.center,
        frame: $rect(10, 40, 355, 35),
        autoFontSize: true
      }
    },
    {
      type: "label",
      props: {
        id: "userinfo",
        text: "帖子：0   关注者：0",
        textColor: $color("lightGray"),
        align: $align.center,
        frame: $rect(75 / 2, 75, 300, 40),
        autoFontSize: true
      }
    },
    {
      type: "label",
      props: {
        id: "status",
        align: $align.center,
        frame: $rect(0, 485, 375, 90),
        autoFontSize: true,
        lines: 0
      }
    },
    {
      type: "image",
      props: {
        id: "userimage",
        src: "https://www.instagram.com/static/images/ico/apple-touch-icon-180x180-precomposed.png/94fd767f257b.png",
        frame: $rect((375 - 250) / 2, 120, 250, 250),
        radius: 50,
        borderWidth: 1,
        borderColor: $color("#1e7183")
      }
    },
    {
      type: "tab",
      props: {
        id: "mode",
        tintColor: $color("#1e7183"),
        frame: $rect((375 - 200) / 2, 385, 200, 35),
        items: ["下载图片", "下载视频", "全部下载"]
      }
    },
    {
      type: "button",
      props: {
        id: "downbutton",
        title: "下 载",
        font: $font("bold", 20),
        frame: $rect((375 - 200) / 2, 430, 200, 40),
        bgcolor: $color("lightGray"),
        userInteractionEnabled: false
      },
      events: {
        tapped: function(sender) {
          $app.idleTimerDisabled = true;
          $device.taptic();
          $("downbutton").bgcolor = $color("lightGray");
          $("downbutton").userInteractionEnabled = false;
          if (!$drive.exists("instagram/" + $("username").text)) {
            $drive.mkdir("instagram/" + $("username").text)
          };
          getMediaCode();
          $("status").text = "正在与instagram服务器通讯..."
        }
      }
    },
  ]
})

function run() {
  var match = /^http.+?instagram.com\/[^\/]+?\/?$/g.exec(input);
  if (match) {
    $("username").text = "载入中...";
    getUserInfo();
  } else {
    $ui.toast("未检测到instagram用户主页地址！");
    $("status").text = "请检查复制的地址是否为用户主页地址！"
  }
}

function getUserInfo() {
  var username = input.split("/")[input.split("/").length - (input.endsWith("/") ? 2 : 1)];
  $http.get({
    header: header,
    url: "https://www.instagram.com/" + username,
    handler: function(resp) {
      var match = /window\.\_sharedData\s=\s.+?(?=\;\<\/script\>)/g.exec(resp.data)[0].replace("window._sharedData = ", "");
      var json = JSON.parse(match).entry_data.ProfilePage[0].user;
      homePageJson = json;
      $("username").text = json.full_name || username;
      $("userinfo").text = "帖子:" + json.media.count + "   关注者:" + json.followed_by.count;
      $("userimage").src = json.profile_pic_url_hd;
      $("downbutton").bgcolor = $color("#1e7183");
      $("downbutton").userInteractionEnabled = true;
      $("status").text = "已准备就绪！";
    }
  })
}

function getMediaCode(after) {
  var userid = homePageJson.id;
  var count = homePageJson.media.count;
  var queryvar = {
    "id": userid,
    "after": after,
    "first": 500
  };
  var url = "https://www.instagram.com/graphql/query/?query_id=17888483320059182&variables=" + encodeURI(JSON.stringify(queryvar));
  $http.get({
    header: header,
    url: url,
    handler: function(resp) {
      $("status").text = "正在遍历贴文获取贴文编号...\n进度：" + mediaCode.length + "/" + homePageJson.media.count;
      if (mediaCode.length < count) {
        getMediaCode(makeCode(resp.data));
      } else {
        makeUrl()
      }
    }
  })
}

function makeCode(resdata) {
  var json = resdata.data.user.edge_owner_to_timeline_media;
  mediaCode.push.apply(mediaCode, json.edges.map(function(i) { return i.node.shortcode }));
  return json.page_info.end_cursor;
}

function getMediaUrl(code) {
  $http.get({
    header: header,
    url: "https://www.instagram.com/p/" + code + "/?__a=1",
    handler: function(resp) {
      getTask.shift(code);
      var json = resp.data.graphql.shortcode_media.edge_sidecar_to_children;
      if (json) {
        addUrl(json.edges, 2)
      } else {
        addUrl(resp.data.graphql.shortcode_media, 1)
      };
      if (mediaCode.length > 0) { makeUrl() } else if (mediaCode.length == 0 && getTask.length == 0) {
        if ($("mode").index == 0) {
          downUrl.push.apply(downUrl, imageUrl)
        } else if ($("mode").index == 1) {
          downUrl.push.apply(downUrl, videoUrl)
        } else {
          downUrl = imageUrl.concat(videoUrl)
        };
        allCount = downUrl.length;
        startTime = new Date();
        makeDown();
      }
    }
  })
}

function addUrl(json, mode) {
  if (mode == 1) {
    json.is_video ? videoUrl.push(json.video_url) : imageUrl.push(json.display_url)
  } else {
    json.map(function(i) {
      i.node.is_video ? videoUrl.push(i.node.video_url) : imageUrl.push(i.node.display_url)
    })
  }
  $("status").text = "正在抓取媒体下载地址...\n图片: " + imageUrl.length + " |  视频:" + videoUrl.length;
}

function makeUrl() {
  var add = 40 - getTask.length;
  if (add > 0) {
    var item = mediaCode.splice(0, add);
    getTask.push.apply(getTask, item);
    item.map(function(code) {
      getMediaUrl(code)
    })
  }
}

function download(url) {
  $http.download({
    header: header,
    url: url,
    timeout: 5,
    message: "下载",
    handler: function(resp) {
      if (!resp.data) {
        makeDown();
        return
      };
      var ext = resp.response.suggestedFilename.split(".").pop();
      var fileSize = resp.response.expectedContentLength;
      size += fileSize;
      downloaded.push(url);
      downTask.shift(url);
      save(resp.data, ext);
      if (downUrl.length == 0 && downTask.length == 0) {
        endTime = new Date();

        $app.idleTimerDisabled = false;
        $("downbutton").bgcolor = $color("#1e7183");
        $("downbutton").userInteractionEnabled = true;
        var time = "耗时" + (endTime - startTime) / 1000 > 60 ?
          Math.round((endTime - startTime) / 1000 / 60) + "分" : Math.round((endTime - startTime) / 1000) + "秒";
        $("status").text = "下载完成！文件数:" + allCount + "，总大小:" + Math.round(size / 1000 / 1000) + "M\n总耗时" + time + "，保存目录：\niCloud/Pin/ instagram/"
      } else {
        makeDown()
      }
    }
  })
}

function makeDown() {
  var add = 40 - downTask.length;
  if (add > 0) {
    var item = downUrl.splice(0, add);
    downTask.push.apply(downTask, item);
    item.map(function(url) {
      download(url)
    })
  }
}

function save(data, ext) {
  var saveDir = "instagram/" + $("username").text;
  var name = $("username").text + downloaded.length;
  $("status").text = "正在下载...\n进度：" + downloaded.length + "/" + allCount;
  var path = saveDir + "/" + name + "." + ext;
  $drive.write({
    data: data,
    path: path
  });
}

var header = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
  'Referer': 'https://www.instagram.com/'
};
var mediaCode = [],
  videoUrl = [],
  imageUrl = [],
  downTask = [],
  getTask = [],
  downUrl = [],
  downloaded = [];
size = 0;
var input = $context.link || $clipboard.link;
if (input) {
  $("input").text = input;
  run()
}
