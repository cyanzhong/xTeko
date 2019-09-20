const ui = require("./ui");

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
      register("hide:", "UIKeyboardWillHideNotification");
      return self;
    },
    "show": note => {
      const info = note.$userInfo();
      const frame = info.$objectForKey("UIKeyboardFrameEndUserInfoKey");
      const rect = frame.$CGRectValue();
      const height = rect.height;
      resize(height);
    },
    "hide": note => {
      resize(0);
    }
  }
});

function resize(height) {
  ui.resizeViews(height);
}

exports.observe = () => {
  let keyMan = $objc("KeyMan").$new();
  $objc_retain(keyMan);
}