const settings = require("./settings");

$define({
  type: "EventDispatcher",
  events: {
    "touchDown:": sender => {
      self.$keyDown(sender.rawValue().id);
    },
    "touchUp:": sender => {
      self.$keyUp(sender.rawValue().id);
    },
    "keyDown:": keyCode => {
      if (settings.tapticEnabled) {
        $device.taptic(0);
      }
      $("console").eval({"script": `nes_keydown('${keyCode.rawValue()}')`});
    },
    "keyUp:": keyCode => {
      $("console").eval({"script": `nes_keyup('${keyCode.rawValue()}')`});
    },
    "resetKeys": () => {
      $("console").eval({"script": `nes_reset_keys()`});
    }
  }
});

let dispatcher = $objc("EventDispatcher").$new();
$objc_retain(dispatcher);
module.exports = dispatcher;