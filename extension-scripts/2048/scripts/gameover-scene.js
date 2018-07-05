var builder = require("./builder");
var constants = require("./constants");

$define({
  type: "GameOverScene: SKScene",
  events: {
    "initWithSize:flag:": function(size, flag) {
      return init(self, size, flag);
    },
    "newGameBtnTapped": newGameBtnTapped
  }
});

function init(self, size, flag) {

  self = self.invoke("super.initWithSize", size);
  self.invoke("setScaleMode", 2);
  self.invoke("setBackgroundColor", constants.colors.backgroud);

  // Label
  var labelNode = builder.labelNode(flag ? "Yin Win!" : "You Lose~", 52, constants.colors.darkText, constants.fontNames.markerFeltWide);
  labelNode.invoke("setPosition", { x: size.width / 2, y: size.height - labelNode.invoke("frame").height / 2 - 40 });
  self.invoke("addChild", labelNode);

  // Button
  var btnColor = constants.colors.orange;
  var btnSize = { width: size.width - constants.insets * 2, height: 40 };
  var newBtnNode = $objc("ButtonNode").invoke("alloc.initWithColor:size:title:target:action:", btnColor, btnSize, "NEW GAME", self, "newGameBtnTapped:");
  newBtnNode.invoke("setPosition", { x: btnSize.width / 2 + constants.insets, y: constants.insets + btnSize.height / 2 });
  self.invoke("addChild", newBtnNode);

  return self;
}

function newGameBtnTapped(sender) {
  var view = self.invoke("view");
  var size = self.invoke("size");
  var scene = $objc("MainScene").invoke("alloc.initWithSize", size);
  var transition = $objc("SKTransition").invoke("crossfadeWithDuration", 0.4);
  view.invoke("presentScene:transition:", scene, transition);
}