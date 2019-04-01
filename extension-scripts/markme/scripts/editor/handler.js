$define({
  type: "MMWebMessageHandler: NSObject<WKScriptMessageHandler>",
  events: {
    "webView:didFinishNavigation:": (webView, navigation) => {
      const script = 
      `
      ${$file.read("assets/html2canvas.js").string}

      html2canvas(document.querySelector(".markdown-body")).then(canvas => {
        const dataURL = canvas.toDataURL("image/png");
        window.webkit.messageHandlers.render.postMessage(dataURL);
      });
      `;
      webView.$evaluateJavaScript_completionHandler(script, null);
    },
    "userContentController:didReceiveScriptMessage:": (controller, message) => {
      if (message.$name().rawValue() === "render") {
        $ui.loading(false);
        
        const body = message.$body().rawValue();
        const data = $data({"base64": body});
        $share.sheet(data.image);
        _webView.$removeFromSuperview();
      }
    }
  }
});

let _webView = null;
exports.connect = webView => {
  const handler = $objc("MMWebMessageHandler").$new();
  _webView = webView;
  _webView.$setNavigationDelegate(handler);
  return handler;
}