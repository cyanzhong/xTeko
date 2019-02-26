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
      let left = x < width;
      let right = x > width + height;
      let up = y < width;
      let down = y > width + height;
      if (left && up) {
        return "LU";
      } else if (left && down) {
        return "LD";
      } else if (right && up) {
        return "RU";
      } else if (right && down) {
        return "RD";
      } else if (left) {
        return "L";
      } else if (right) {
        return "R";
      } else if (up) {
        return "U";
      } else if (down) {
        return "D";
      } else {
        return "#";
      }
    },
  }
});

let joystick = $objc("Joystick").$new();
module.exports = joystick;