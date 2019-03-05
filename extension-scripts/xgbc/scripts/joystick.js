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
      
      let vl = width - x;
      let vr = x - width - height;
      let vu = width - y;
      let vd = y - width - height;

      function combo(lhs, rhs) {
        return Math.abs(lhs - rhs) < 25;
      }

      if (l && u) {
        if (combo(vl, vu)) {
          return "LU";
        } else {
          return vl > vu ? "L" : "U";
        }
      } else if (l && d) {
        if (combo(vl, vd)) {
          return "LD";
        } else {
          return vl > vd ? "L" : "D";
        }
      } else if (r && u) {
        if (combo(vr, vu)) {
          return "RU";
        } else {
          return vr > vu ? "R" : "U";
        }
      } else if (r && d) {
        if (combo(vr, vd)) {
          return "RD";
        } else {
          return vr > vd ? "R" : "D";
        }
      }
      
      if (l) {
        return "L";
      } else if (r) {
        return "R";
      } else if (u) {
        return "U";
      } else if (d) {
        return "D";
      }

      return "#";
    },
  }
});

let joystick = $objc("Joystick").$new();
module.exports = joystick;