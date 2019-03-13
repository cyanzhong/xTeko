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
      if (y < height / 3) {
        return "ESC";
      } else if (y > height / 3 && y < height * 2 / 3) {
        return "SPACE";
      } else {
        return "ENTER";
      }
    }
  }
});

let buttons = $objc("HitButtons").$new();
module.exports = buttons;