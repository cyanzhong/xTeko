var builder = require("./builder");

$define({
  type: "RectNode: SKSpriteNode",
  props: ["shapeNode"],
  events: {
    "initWithColor:size:": function(color, size) {
      return init(self, color, size);
    }
  }
});

function init(self, color, size) {
  self = self.$super().$init();
  var frame = { x: -size.width / 2, y: -size.height / 2, width: size.width, height: size.height };
  var shapeNode = builder.rect(frame, 4, color);
  self.$addChild(shapeNode);
  self.$setShapeNode(shapeNode);
  return self;
}