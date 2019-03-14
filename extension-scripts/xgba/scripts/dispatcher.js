const constants = require("./constants");
const settings = require("./settings");
const downKeys = {};

$define({
  type: "EventDispatcher",
  events: {
    "touchDown:": sender => {
      self.$keyDown_taptic(sender.rawValue().id, true);
    },
    "touchUp:": sender => {
      let that = self;
      $delay(constants.touchUpDelay, () => {
        that.$keyUp(sender.rawValue().id);
      });
    },
    "keyDown:taptic:": (keyCode, taptic) => {
      let key = keyCode.rawValue();
      
      if (downKeys[key] || false) {
        return;
      }

      if (taptic && settings.tapticEnabled()) {
        $device.taptic(0);
      }

      self.$evaluate(`keyDown('${key}')`);
      downKeys[key] = true;
    },
    "keyUp:": keyCode => {
      let key = keyCode.rawValue();
      self.$evaluate(`keyUp('${key}')`);
      downKeys[key] = false;
    },
    "resetKeys": () => {
      self.$evaluate("resetKeys()");
    },
    "evaluate": script => {
      let canvas = $("canvas");
      if (canvas) {
        canvas.eval({"script": script});
      }
    }
  }
});

let dispatcher = $objc("EventDispatcher").$new();
$objc_retain(dispatcher);
module.exports = dispatcher;