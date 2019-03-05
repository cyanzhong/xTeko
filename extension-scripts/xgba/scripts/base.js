const constants = require("./constants");
const dispatcher = require("./dispatcher");

$define({
  type: "BitBoxButton: UIView",
  props: ["keyDownHandler", "keyUpHandler", "keyCode"],
  events: {
    "init": () => {
      self = self.$super().$init();
      self.$setKeyDownHandler(keyCode => {
        let btn = $(keyCode.rawValue());
        if (btn) {
          btn.alpha = 0.4;
          dispatcher.$keyDown_taptic(keyCode, true);
        } else {
          resetKeys();
        }
      });
      self.$setKeyUpHandler(keyCode => {
        let btn = $(keyCode.rawValue());
        if (btn) {
          btn.alpha = 1.0;
          dispatcher.$keyUp(keyCode);
        } else {
          resetKeys();
        }
      });
      return self;
    },
    "touchesBegan:withEvent:": (touches, event) => {
      let oldValue = self.$keyCode();
      if (oldValue) {
        self.$keyUp(oldValue);
      }

      let keyCode = self.$getKeyCode(touches);
      self.$keyDown(keyCode);
      self.$setKeyCode(keyCode);
    },
    "touchesMoved:withEvent:": (touches, event) => {
      let oldValue = self.$keyCode();
      let keyCode = self.$getKeyCode(touches);
      if (!keyCode.$isEqualToString(oldValue)) {
        self.$keyUp(oldValue);
      }

      self.$keyDown(keyCode);
      self.$setKeyCode(keyCode);
    },
    "touchesEnded:withEvent:": (touches, event) => {
      let keyCode = self.$getKeyCode(touches);
      if (keyCode) {
        let that = self;
        $delay(constants.touchUpDelay, () => {
          that.$keyUp(keyCode);
        });
      }

      self.$setKeyCode(null);
    },
    "touchesCancelled:withEvent:": (touches, event) => {
      self.$touchesEnded_withEvent(touches, event);
    },
    "keyDown:": keyCode => {
      let handler = self.$keyDownHandler();
      if (handler) {
        handler(keyCode);
      }
    },
    "keyUp:": keyCode => {
      let handler = self.$keyUpHandler();
      if (handler) {
        handler(keyCode);
      }
    },
    "getKeyCode:": touches => {
      return null;
    },
  }
});

function resetKeys() {
  dispatcher.$resetKeys();
  let views = $("joystick").views;
  views.forEach(view => view.alpha = 1.0);
}