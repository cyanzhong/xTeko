let notifyChange = () => {};

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
    "show": note => {
      const info = note.$userInfo();
      const frame = info.$objectForKey("UIKeyboardFrameEndUserInfoKey");
      const rect = frame.$CGRectValue();
      const height = rect.height;
      notifyChange(height);
    },
    "hide": note => {
      notifyChange(0);
    }
  }
});

exports.observe = changed => {
  notifyChange = changed;
  let keyMan = $objc("KeyMan").$new();
  $objc_retain(keyMan);
}