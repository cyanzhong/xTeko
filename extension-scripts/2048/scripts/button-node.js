var builder = require("./builder");
var constants = require("./constants");
var helper = require("./helper");

$define({
  type: "ButtonNode: RectNode",
  props: [
    "shapeColor",
    "labelNode",
    "target",
    "action",
  ],
  events: {
    "initWithColor:size:title:target:action:": function(color, size, title, target, action) {
      return init(self, color, size, title, target, action);
    },
    "setText": function(text) {
      self.invoke("labelNode.setText", text);
    },
    "setSelected": function(selected) {
      var color = self.invoke("shapeColor");
      var shapeColor = selected ? color.invoke("colorWithAlphaComponent", 0.5) : color;
      var shapeNode = self.invoke("shapeNode");
      shapeNode.invoke("setStrokeColor", shapeColor);
      shapeNode.invoke("setFillColor", shapeColor);
    },
    "touchesBegan:withEvent:": function(touches, event) {
      self.invoke("setSelected", true);
    },
    "touchesMoved:withEvent:": function(touches, event) {
      var touch = touches.invoke("anyObject");
      var point = touch.invoke("locationInNode", self);
      var size = self.invoke("size");
      point.x = point.x + size.width / 2;
      point.y = point.y + size.height / 2;
      var frame = { x: 0, y: 0, width: size.width, height: size.height };
      self.invoke("setSelected", helper.pointInRect(point, frame));
    },
    "touchesCancelled:withEvent:": function(touches, event) {
      self.invoke("setSelected", false);
    },
    "touchesEnded:withEvent:": function(touches, event) {
      self.invoke("setSelected", false);
      var action = self.invoke("action");
      var target = self.invoke("target");
      helper.sendAction(action, target);
    }
  }
});

function init(self, color, size, title, target, action) {

  self = self.invoke("super.initWithColor:size:", color, size);
  self.invoke("setShapeColor", color);
  self.invoke("setSize", size);

  // Target action
  self.invoke("setTarget", target);
  self.invoke("setAction", action);
  self.invoke("setUserInteractionEnabled", true);

  // Label
  var labelNode = builder.labelNode(title, 15);
  self.invoke("addChild", labelNode);
  self.invoke("setLabelNode", labelNode);
  self.invoke("setSelected", false);

  return self;
}