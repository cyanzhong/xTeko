var builder = require("./builder");
var constants = require("./constants");

$define({
  type: "ScoreNode: RectNode",
  props: ["labelNode"],
  events: {
    "initWithText:size:": function(text, size) {
      return init(self, text, size);
    },
    "setNumber": setNumber,
    "number": function() {
      return self.invoke("labelNode.text.intValue");
    }
  }
});

function init(self, text, size) {

  self = self.invoke("super.initWithColor:size:", constants.colors.darkGray, size);

  // Title
  var titleNode = builder.labelNode(text, 12, constants.colors.backgroud);
  titleNode.invoke("setPosition", { x: 0, y: titleNode.invoke("frame").height });
  self.invoke("addChild", titleNode);

  var labelNode = builder.labelNode("0", 22, constants.colors.white);
  labelNode.invoke("setPosition", { x: 0, y: -labelNode.invoke("frame").height / 2 });
  self.invoke("addChild", labelNode);
  self.invoke("setLabelNode", labelNode);

  return self;
}

function setNumber(number) {
  var labelNode = self.invoke("labelNode");
  labelNode.invoke("setText", number.toString());
}