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

  self = self.$super().$initWithSize(size);
  self.$setScaleMode(2);
  self.$setBackgroundColor(constants.colors.backgroud);

  // Label
  var labelNode = builder.labelNode(flag ? "Yin Win!" : "You Lose~", 52, constants.colors.darkText, constants.fontNames.markerFeltWide);
  labelNode.$setPosition({ x: size.width / 2, y: size.height - labelNode.$frame().height / 2 - 40 });
  self.$addChild(labelNode);

  // Button
  var btnColor = constants.colors.orange;
  var btnSize = { width: size.width - constants.insets * 2, height: 40 };
  var newBtnNode = ButtonNode.$alloc().$initWithColor_size_title_target_action(btnColor, btnSize, "NEW GAME", self, "newGameBtnTapped:");
  newBtnNode.$setPosition({ x: btnSize.width / 2 + constants.insets, y: constants.insets + btnSize.height / 2 });
  self.$addChild(newBtnNode);

  return self;
}

function newGameBtnTapped(sender) {
  var view = self.$view();
  var size = self.$size();
  var scene = MainScene.$alloc().$initWithSize(size);
  var transition = SKTransition.$crossfadeWithDuration(0.4);
  view.$presentScene_transition(scene, transition);
}