const util = require("../common/util");

$define({
  type: "MMRenderer: MarkdownViewer",
  events: {
    "render:": markdown => {
      const html = util.toHTML(markdown.rawValue(), true);
      const webView = self.$webView();
      webView.$loadHTMLString_baseURL(html, null);
    }
  }
});

exports.new = () => {
  const renderer = $objc("MMRenderer").$new();
  return renderer;
}