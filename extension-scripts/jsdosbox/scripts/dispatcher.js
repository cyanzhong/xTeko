const constants = require("./constants");
const keys = require("./fn").keys();
const fns = ["FN1", "FN2", "FN3", "FN4", "FN5", "FN6", "FN7", "FN8"];
const downKeys = {};

function fnKeyInfo(sender) {
  let index = fns.indexOf(sender.rawValue().id);
  return index >= 0 ? keys[index] : null;
}

$define({
  type: "EventDispatcher",
  events: {
    "fnDown:": sender => {
      let key = fnKeyInfo(sender);
      if (key) {
        self.$evaluate(`keyCodeDown(${key.code}, ${key.shift || false}, ${key.ctrl || false}, ${key.alt || false}, ${key.meta || false})`);
      }
    },
    "fnUp:": sender => {
      let that = self;
      let key = fnKeyInfo(sender);
      $delay(constants.touchUpDelay, () => {
        that.$evaluate(`keyCodeUp(${key.code}, ${key.shift || false}, ${key.ctrl || false}, ${key.alt || false}, ${key.meta || false})`);
      });
    },
    "keyDown:": keyCode => {
      let key = keyCode.rawValue();
      
      if (downKeys[key] || false) {
        return;
      }

      self.$evaluate(`keyDown('${key}')`);
      downKeys[key] = true;
    },
    "keyUp:": keyCode => {
      let key = keyCode.rawValue();
      self.$evaluate(`keyUp('${key}')`);
      downKeys[key] = false;
    },
    "keyPress:shift:ctrl:alt:meta": (keyCode, shift, ctrl, alt, meta) => {
      self.$evaluate(`keyCodePress(${keyCode}, ${shift || false}, ${ctrl || false}, ${alt || false}, ${meta || false})`);
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