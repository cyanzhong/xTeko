require("./base");

const constants = require("./constants");

$define({
  type: "Joystick: BitBoxButton",
  events: {
    "getKeyCode:": touches => {
      let screen = $device.info.screen;
      let landscapeMode = screen.width > screen.height;
      
      let width = constants.btnSize.leftRight.width;
      let height = constants.btnSize.leftRight.height;

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

      if (l && u) {
        return vl > vu ? "LEFT" : "UP";
      } else if (l && d) {
        return vl > vd ? "LEFT" : "DOWN";
      } else if (r && u) {
        return vr > vu ? "RIGHT" : "UP";
      } else if (r && d) {
        return vr > vd ? "RIGHT" : "DOWN";
      }
      
      if (l) {
        return "LEFT";
      } else if (r) {
        return "RIGHT";
      } else if (u) {
        return "UP";
      } else if (d) {
        return "DOWN";
      }

      return "#";
    },
  }
});

let joystick = $objc("Joystick").$new();
module.exports = joystick;