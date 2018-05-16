const engines = [
  {
    name: "谷歌搜索",
    pattern: "https://images.google.com/searchbyimage?image_url="
  },
  {
    name: "百度搜索",
    pattern: "http://image.baidu.com/n/pc_search?queryImageUrl="
  },
  {
    name: "搜狗搜索",
    pattern: "http://pic.sogou.com/ris?flag=1&nr=true&query="
  }
]

function pickImage() {
  $photo.pick({
    handler: function(resp) {
      var image = resp.image
      if (image) {
        searchImage(image.jpg(1.0))
      } else {
        $ui.loading(false)
      }
    }
  })
}

function searchImage(data) {
  $ui.loading(true)
  $http.upload({
    url: "https://sm.ms/api/upload",
    files: [{"data": data, "name": "smfile"}],
    handler: function(resp) {
      $ui.loading(false)
      var url = resp.data.data.url
      if (url) {
        showEngines(url)
      }
    }
  })
}

function showEngines(url) {
  $ui.menu({
    items: engines.map(function(item) { return item.name }),
    handler: function(title, idx) {
      var pattern = engines[idx].pattern
      $app.openURL(pattern + $text.URLEncode(url))
      $app.close()
    }
  })
}

var inputData = $context.data
var inputImage = $context.image
var inputLink = $context.link
var clipData = $clipboard.image
var clipLink = $clipboard.link

if (inputData) {
  searchImage(inputData)
} else if (inputImage) {
  searchImage(inputImage.jpg(1.0))
} else if (inputLink) {
  showEngines(inputLink)
} else if (clipData) {
  $ui.menu({
    items: ["搜索剪贴板图片", "从相册选择图片"],
    handler: function(title, idx) {
      idx == 0 ? searchImage(clipData) : pickImage()
    }
  })
} else if (clipLink) {
  $ui.menu({
    items: ["搜索剪贴板链接", "从相册选择图片"],
    handler: function(title, idx) {
      idx == 0 ? showEngines(clipLink) : pickImage()
    }
  })
} else {
  pickImage()
}