const util = require("./util");

$define({
  type: "KeyMan: NSObject",
  events: {
    "init": () => {
      self = self.$super().$init();

      const center = $objc("NSNotificationCenter").$defaultCenter();
      const observer = self;
      const register = (selector, name) => {
        center.$addObserver_selector_name_object(observer, selector, name, null);
      }

      register("show:", "UIKeyboardWillShowNotification");
      register("show:", "UIKeyboardDidShowNotification");
      register("hide:", "UIKeyboardDidHideNotification");
      return self;
    },
    "show:": note => {
      notifyChange(note);
      util.enableBackGesture(false);
    },
    "hide:": note => {
      notifyChange(null);
      util.enableBackGesture(true);
    }
  }
});

function notifyChange(note) {
  const height = (() => {
    if (note) {
      const info = note.$userInfo();
      const frame = info.$objectForKey("UIKeyboardFrameEndUserInfoKey").$CGRectValue();
      return frame.height;
    } else {
      return 0;
    }
  })();

  handlers.forEach(handler => handler(height));
}

let handlers = [];
exports.observe = handler => {
  if (handler) {
    handlers.push(handler);
  }

  $objc_retain($objc("KeyMan").$new());
}