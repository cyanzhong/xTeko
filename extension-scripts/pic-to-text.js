const baidu_api_auth = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='
const baidu_ocr_api = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token='
const baidu_ocr_api_key = ''
const baidu_ocr_sec_key = ''
var baidu_access_token = ''

function requestBaiduOcr(data, imageOrUrl) {
  $http.post({
    url: baidu_api_auth + baidu_ocr_api_key + '&client_secret=' + baidu_ocr_sec_key,
    handler: function(resp) {
      baidu_access_token = resp.data.access_token
      requestBaiduOcrApi(data, imageOrUrl)
    }
  })
}

function requestBaiduOcrApi(data, imageOrUrl) {
  if (!baidu_access_token) {
    return
  }
  var requestData
  if (imageOrUrl) {
    requestData = {'image': $text.URLEncode($text.base64Encode(data))}
  } else {
    requestData = {'url': data}
  }
  $http.post({
    url: baidu_ocr_api + baidu_access_token,
    header: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: requestData,
    handler: function(resp) {
      resultData = resp.data
      $ui.alert(resultData)
    }
  }) 
}

function pickImage() {
  $photo.pick({
    handler: function(resp) {
      var image = resp.image
      if (image) {
        requestBaiduOcr(image.jpg(1.0), true)
      } else {
        $ui.loading(false)
      }
    }
  })
}

var inputData = $context.data
//var inputLink = $context.link
var clipData = $clipboard.image
var clipLink = $clipboard.link

if (clipLink) {
  $ui.menu({
    items: ["搜索剪贴板链接", "从相册选择图片"],
    handler: function(title, idx) {
      idx == 0 ? requestBaiduOcr(clipLink, false) : pickImage()
    }
  })
} else {
  $ui.menu({
    items: ["搜索剪贴板图片", "从相册选择图片"],
    handler: function(title, idx) {
      idx == 0 ? requestBaiduOcr(clipData, true) : pickImage()
    }
  })
}