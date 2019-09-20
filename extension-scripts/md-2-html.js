var text = $context.text || $clipboard.text
$ui.loading(true)
$http.post({
  url: "https://api.github.com/markdown",
  body: { text: text, mode: "gfm", context: "github/gollum" },
  handler: function(resp) {
    $ui.loading(false)
    var html = resp.data
    $ui.menu({
      items: ["预览结果", "拷贝到剪贴板", "创建 PDF 文件"],
      handler: function(title, idx) {
        if (idx == 0) {
          $quicklook.open({html: html})
        } else if (idx == 1) {
          $clipboard.html = html
        } else {
          $pdf.make({
            html: html,
            handler: function(resp) {
              if (resp.data) {
                $share.sheet(["sample.pdf", resp.data])
              }
            }
          })
        }
      }
    })
  }
})