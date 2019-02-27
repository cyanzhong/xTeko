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
      self.$evaluate(`keyDown('${keyCode.rawValue()}')`);
    },
    "keyUp:": keyCode => {
      self.$evaluate(`keyUp('${keyCode.rawValue()}')`);
    },
    "resetKeys": () => {
      self.$evaluate("resetKeys()");
    },
    "evaluate": script => {
      $("console").eval({"script": script});
    }
  }
});

let dispatcher = $objc("EventDispatcher").$new();
$objc_retain(dispatcher);
module.exports = dispatcher;