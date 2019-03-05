require("./base");

const constants = require("./constants");

$define({
  type: "HitButtons: BitBoxButton",
  events: {
    "getKeyCode:": touches => {
      let touch = touches.$anyObject();
      let pt = touch.$locationInView(self);
      let x = pt.x;
      let y = pt.y;
      let width = self.$frame().width;
      let height = self.$frame().height;
      let left = x < width / 2;
      let top = y < (height - constants.magicTouchHeight) / 2;
      if (top) {
        return "BA";
      } else {
        if (left) {
          return "B";
        } else {
          return "A";
        }
      }
    }
  }
});

let buttons = $objc("HitButtons").$new();
module.exports = buttons;