const toolbar = require("../editor/toolbar");

exports.register = () => {
  exports.unregister();

  $define({
    type: "WKWebView",
    events: {
      "canPerformAction:withSender:": (action, sender) => {
        const selector = action.jsValue();
        const whiteList = ["_lookup:", "_share:"];
        if (selector.startsWith("_") && whiteList.indexOf(selector) === -1) {
          return false;
        }

        return self.$ORIGcanPerformAction_withSender(action, sender);
      }
    }
  });
  
  $define({
    type: "WKContentView",
    props: ["inputView"],
    events: {
      "didMoveToWindow": () => {
        self.$ORIGdidMoveToWindow();

        const inputView = toolbar.new();
        self.$setInputView(inputView);
      },
      "inputAccessoryView": () => {
        return self.$inputView();
      }
    }
  });
}

exports.unregister = () => {
  const core = $objc("RedBoxCore");
  core.$cleanClass("WKWebView");
  core.$cleanClass("WKContentView");
}