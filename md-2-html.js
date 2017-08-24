var text = $context.text || $clipboard.text
$http.post({
  url: "https://api.github.com/markdown",
  body: { text: text, mode: "gfm", context: "github/gollum" },
  handler: function(resp) {
    var html = resp.data
    $ui.menu({
      items: ["拷贝到剪贴板", "创建 PDF 文件"],
      handler: function(title, idx) {
        if (idx == 0) {
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