const ocrEngines = [
  {
    name: "百度 OCR",
    api_url: "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic",
    api_key: "",
    sec_key: "",
    access_token: ""
  }
]

function pickImage() {
  $photo.pick({
    handler: function(resp) {
      var image = resp.image
      if (image) {
        ocrImage(image.jpg(1.0))
      } else {
        $ui.loading(false)
      }
    }
  })
}

function ocrImage(data) {
  $ui.loading(true)
  var encodedData = encodeURI(btoa(data))
  showOcrEngines(encodedData)
  
}

function showOcrEngines(imageData) {
  $ui.menu({
    items: ocrEngines.map(function(item) { return item.name }),
    handler: function(title, idx) {
      var api_url = ocrEngines[idx].api_url
      $http.request({
        header: { "Content-Type":"application/x-www-form-urlencoded" },
        body: imageData,
        handler: function(resp) {
          $ui.alert(resp.data)
        }
      })
    }
  })
}

var inputData = $context.data
//var inputLink = $context.link
var clipData = $clipboard.image
//var clipLink = $clipboard.link

if (inputData) {
  ocrImage(inputData)
//} else if (inputLink) {
//  showEngines(inputLink)
} else if (clipData) {
  $ui.menu({
    items: ["搜索剪贴板图片", "从相册选择图片"],
    handler: function(title, idx) {
      idx == 0 ? searchImage(clipData) : pickImage()
    }
  })
// } else if (clipLink) {
//   $ui.menu({
//     items: ["搜索剪贴板链接", "从相册选择图片"],
//     handler: function(title, idx) {
//       idx == 0 ? showEngines(clipLink) : pickImage()
//     }
//   })
} else {
  pickImage()
}