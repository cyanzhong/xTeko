let needsFocus = false;

$define({
  type: "EventHandler: NSObject",
  events: {
    "didSelectMenuItem:": sender => {
      const editor = $("editor");
      const renderer = $("renderer");
      let editorAlpha;
      let rendererAlpha;

      if (sender.$selectedSegmentIndex() == 0) {
        editorAlpha = 1;
        rendererAlpha = 0;
        if (needsFocus) {
          editor.focus();
        }
      } else {
        needsFocus = editor.runtimeValue().$isFirstResponder();
        editor.blur();
        editorAlpha = 0;
        rendererAlpha = 1;
        renderer.runtimeValue().$render(editor.text);
        injectStyleSheet(renderer);
      }

      $ui.animate({
        duration: 0.15,
        animation: () => {
          editor.alpha = editorAlpha;
          renderer.alpha = rendererAlpha;
        }
      });
    }
  }
});

exports.setup = () => {
  const controller = $ui.controller.runtimeValue();
  const navigationItem = controller.$navigationItem();
  const eventHandler = $objc("EventHandler").$new();
  $objc_retain(eventHandler);

  navigationItem.$setTitleView((() => {
  
    const items = $objc("NSMutableArray").$array();
    items.$addObject($l10n("EDIT"));
    items.$addObject($l10n("PREVIEW"));
  
    const menu = $objc("UISegmentedControl").$alloc().$initWithItems(items);
    menu.$setSelectedSegmentIndex(0);
    menu.$setWidth_forSegmentAtIndex(64, 0);
    menu.$setWidth_forSegmentAtIndex(64, 1);
    menu.$addTarget_action_forControlEvents(eventHandler, "didSelectMenuItem:", 1 << 12);
  
    return menu;
  })());
}

function injectStyleSheet(renderer) {
  const style = (() => {
    const file = $file.read("assets/style.css");
    return file ? file.string : null;
  })();

  if (style) {
    $delay(0.02, () => {
      const webView = renderer.runtimeValue().$webView().rawValue();
      webView.eval({
        script: 
        `
        (source => {
          const css = _decodeBase64(source);
          const head = document.head || document.getElementsByTagName("head")[0];
        
          const style = document.createElement("style");
          head.appendChild(style);
        
          style.type = "text/css";
          style.appendChild(document.createTextNode(css));
        
          function _decodeBase64(string) {
            return decodeURIComponent(Array.prototype.map.call(atob(string), c => {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(""));
          }
        })("${$text.base64Encode(style)}");
        `
      });
    });
  }
}