var builder = require("./builder");
var constants = require("./constants");

$define({
  type: "ScoreNode: RectNode",
  props: ["labelNode"],
  events: {
    "initWithText:size": function(text, size) {
      return init(self, text, size);
    },
    "setNumber": setNumber,
    "number": function() {
      return self.$labelNode().$text().$intValue();
    }
  }
});

function init(self, text, size) {

  self = self.$super().$initWithColor_size(constants.colors.darkGray, size);

  // Title
  var titleNode = builder.labelNode(text, 12, constants.colors.backgroud);
  titleNode.$setPosition({ x: 0, y: titleNode.$frame().height });
  self.$addChild(titleNode);

  var labelNode = builder.labelNode("0", 22, constants.colors.white);
  labelNode.$setPosition({ x: 0, y: -labelNode.$frame().height / 2 });
  self.$addChild(labelNode);
  self.$setLabelNode(labelNode);

  return self;
}

function setNumber(number) {
  var labelNode = self.$labelNode();
  labelNode.$setText(number.toString());
}