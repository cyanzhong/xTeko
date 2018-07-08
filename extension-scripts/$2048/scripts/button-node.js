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
      self.$labelNode().$setText(text);
    },
    "setSelected": function(selected) {
      var color = self.$shapeColor();
      var shapeColor = selected ? color.$colorWithAlphaComponent(0.5) : color;
      var shapeNode = self.$shapeNode();
      shapeNode.$setStrokeColor(shapeColor);
      shapeNode.$setFillColor(shapeColor);
    },
    "touchesBegan:withEvent:": function(touches, event) {
      self.$setSelected(true);
    },
    "touchesMoved:withEvent:": function(touches, event) {
      var touch = touches.$anyObject();
      var point = touch.$locationInNode(self);
      var size = self.$size();
      point.x = point.x + size.width / 2;
      point.y = point.y + size.height / 2;
      var frame = { x: 0, y: 0, width: size.width, height: size.height };
      self.$setSelected(helper.pointInRect(point, frame));
    },
    "touchesCancelled:withEvent:": function(touches, event) {
      self.$setSelected(false);
    },
    "touchesEnded:withEvent:": function(touches, event) {
      self.$setSelected(false);
      var action = self.$action();
      var target = self.$target();
      helper.sendAction(action, target);
    }
  }
});

function init(self, color, size, title, target, action) {

  self = self.$super().$initWithColor_size(color, size);
  self.$setShapeColor(color);
  self.$setSize(size);

  // Target action
  self.$setTarget(target);
  self.$setAction(action);
  self.$setUserInteractionEnabled(true);

  // Label
  var labelNode = builder.labelNode(title, 15);
  self.$addChild(labelNode);
  self.$setLabelNode(labelNode);
  self.$setSelected(false);

  return self;
}