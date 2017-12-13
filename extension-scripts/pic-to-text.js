$app.strings = {
  'en': {
    'no-input-data': 'No image data',
    'choose-pic-from-album': 'Choose photo from album',
    'search-clip-url': 'Search URL in clipboard',
    'search-clip-data': 'Search image data in clipboard',
    'baidu-api-not-support-https': 'Baidu OCR API does not support HTTPS image link'
  },
  'zh-Hans': {
    'no-input-data': '没有图像数据',
    'choose-pic-from-album': '从相册选择图片',
    'search-clip-url': '搜索剪贴板链接',
    'search-clip-data': '搜索剪贴板图片',
    'baidu-api-not-support-https': '百度 OCR API 不支持图片链接为 HTTPS'
  }
}

const baidu_api_auth = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='
const baidu_ocr_api = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token='
const baidu_ocr_api_key = ''
const baidu_ocr_sec_key = ''

var objImageData = {
  'data': '',
  'isUrl': true,
  'accessToken': ''
}

function requestBaiduOcr(data, isUrl) {
  
  objImageData.isUrl = isUrl
  if (isUrl) {
    objImageData.data = data
    if (data.startsWith('https://')) {
      $ui.alert($l10n('baidu-api-not-support-https'))  
    } else {
      requestBaiduAuth()
    }
  } else {
    objImageData.data = btoa(data)
    requestBaiduAuth()
  }
}

function pickImage() {
  $photo.pick({
    format: 'data',
    handler: function(resp) {
      var image = resp.data
      if (image) {
        requestBaiduOcr(image, false)
      } else {
        $ui.loading(false)
        $ui.alert($l10n('no-input-data'))
      }
    }
  })
}

function requestBaiduAuth() {
  $ui.loading(true)
  $http.post({
    url: baidu_api_auth + baidu_ocr_api_key + '&client_secret=' + baidu_ocr_sec_key,
    handler: function(resp) {
      if (resp && resp.data && resp.data.access_token) {
        objImageData.accessToken = resp.data.access_token
        requestBaiduOcrApi()  
      } else {
        $ui.loading(false)
      }
    }
  })
}

function requestBaiduOcrApi() {
  if (objImageData.isUrl) {
    $http.post({
      url: baidu_ocr_api + objImageData.accessToken,
      header: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: {'url': objImageData.data},
      handler: function(resp) {
        $ui.loading(false)
        resultData = resp.data
        showResult(resultData)
      }
    })   
  } else {
    $http.post({
      url: baidu_ocr_api + objImageData.accessToken,
      header: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: {'image': objImageData.data},
      handler: function(resp) {
        $ui.loading(false)
        resultData = resp.data
        showResult(resultData)
      }
    })   
  }
}

function showResult(data) {
  var paragraph = ''
  paragraph_num = data.words_result_num
  if (paragraph_num > 0) {
    for (var i = 0; i < paragraph_num; i++) {
      paragraph += data.words_result[i].words
      paragraph += '\n'
    }
    $ui.render({
      views: [
        {
          type: 'text',
          props: {
            text: paragraph,
            editable: false
          },
          layout: $layout.fill
        }
      ]
    })
  }
}

var inputData = $context.data
var inputLink = $context.link
var clipData = $clipboard.image
var clipLink = $clipboard.link

if (inputData) {
  requestBaiduOcr(inputData, false)  
} else if (inputLink) {
  requestBaiduOcr(inputLink, true)
} else if (clipLink) {
  $ui.menu({
    items: [$l10n('search-clip-url'), $l10n('choose-pic-from-album')],
    handler: function(title, idx) {
      idx == 0 ? requestBaiduOcr(clipLink, true) : pickImage()
    }
  })
} else if (clipData) {
  $ui.menu({
    items: [$l10n('search-clip-data'), $l10n('choose-pic-from-album')],
    handler: function(title, idx) {
      idx == 0 ? requestBaiduOcr(clipData, false) : pickImage()
    }
  })
} else {
  pickImage()  
}