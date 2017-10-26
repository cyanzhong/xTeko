var text = ($context.safari ? $context.safari.items.source : null) || $context.text || ($context.data ? $context.data.string : null) || $clipboard.text || ""
var code = text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) { return '&#' + i.charCodeAt(0) + ';' })
var html = "<html><link rel='stylesheet' href='http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-dark.min.css'><style>*{margin:0;padding:0;font-size:24px;}</style><script src='http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js'></script><script>hljs.initHighlightingOnLoad();</script><pre><code class='hljs'>" + code + "</code></pre></html>"
$ui.render({
  props: {
    title: "Highlighter"
  },
  views: [{
    type: "web",
    props: {
      html: html
    },
    layout: $layout.fill
  }]
})