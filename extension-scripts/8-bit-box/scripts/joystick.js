require("./base");

const constants = require("./constants");
const width = constants.btnSize.leftRight.width;
const height = constants.btnSize.leftRight.height;

$define({
  type: "Joystick: BitBoxButton",
  events: {
    "getKeyCode:": touches => {
      let touch = touches.$anyObject();
      let pt = touch.$locationInView(self);
      let x = pt.x;
      let y = pt.y;

      let l = x < width;
      let r = x > width + height;
      let u = y < width;
      let d = y > width + height;

      let _s = constants.touchComboScale;
      let _l = x < width * (1 - _s);
      let _r = x > width * (1 + _s) + height;
      let _u = y < width * (1 - _s);
      let _d = y > width * (1 + _s) + height;

      if (_l && _u) {
        return "LU";
      } else if (_l && _d) {
        return "LD";
      } else if (_r && _u) {
        return "RU";
      } else if (_r && _d) {
        return "RD";
      } else if (l) {
        return "L";
      } else if (r) {
        return "R";
      } else if (u) {
        return "U";
      } else if (d) {
        return "D";
      } else {
        return "#";
      }
    },
  }
});

let joystick = $objc("Joystick").$new();
module.exports = joystick;