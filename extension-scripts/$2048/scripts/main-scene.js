var builder = require("./builder");
var helper = require("./helper");
var constants = require("./constants");

$define({
  type: "MainScene: SKScene",
  props: [
    "created",
    "matrixNode",
    "matrixRect",
    "scoreNode",
    "bestNode",
  ],
  events: {
    didMoveToView: function(view) {
      if (!self.$created()) {
        createContent(self);
      }
    },
    swipeEvent: swipeEvent,
    scoreChanged: scoreChanged,
    didFinish: didFinish,
    newGameBtnTapped: newGameBtnTapped,
  }
});

function createContent(self) {
  
  self.$setScaleMode(2);
  self.$setBackgroundColor(constants.colors.backgroud);
  self.$setCreated(true);

  var view = self.$view();
  var sceneRect = self.$frame();
  var sceneSize = { width: sceneRect.width, height: sceneRect.height };

  var matrixSize = (sceneSize.width - constants.insets * 2);
  var matrixRect = {
    x: constants.insets,
    y: (sceneSize.height - matrixSize) / 2,
    width: matrixSize,
    height: matrixSize
  };

  self.$setMatrixRect(matrixRect);

  // Matrix container
  var matrixContainer = builder.rect(matrixRect, 4, constants.colors.darkGray);
  self.$addChild(matrixContainer);

  for (var i=0; i<4; ++i) {
    for (var j=0; j<4; ++j) {
      var inset = constants.insets;
      var size = (matrixSize - 5 * constants.insets) / 4;
      var rect = {
        x: inset + (inset + size) * i,
        y: inset + (inset + size) * j,
        width: size,
        height: size
      };
      var node = builder.rect(rect, 4, constants.colors.gray);
      matrixContainer.$addChild(node);
    }
  }

  // Matrix node
  var matrixNode = $objc("MatrixNode").$new();
  matrixNode.$setSize({ width: matrixSize, height: matrixSize });
  matrixNode.$setPosition({ x: matrixSize / 2, y: matrixSize / 2 });
  matrixNode.$setup();
  matrixNode.$setEventHandler(self);
  matrixContainer.$addChild(matrixNode);
  self.$setMatrixNode(matrixNode);

  // Logo
  var logoNode = builder.labelNode("2048", 52, constants.colors.darkText, constants.fontNames.markerFeltWide);
  var logoRect = logoNode.$frame();
  logoNode.$setPosition({ x: logoRect.width / 2 + constants.insets, y: sceneSize.height - logoRect.height / 2 - constants.insets });
  self.$addChild(logoNode);

  // Slogan
  var sloganNode = builder.labelNode("Join the numbers and get to the 2048 tile!", 13, constants.colors.lightText, constants.fontNames.lato);
  var sloganRect = sloganNode.$frame();
  sloganNode.$setPosition({ x: matrixSize / 2, y: sceneSize.height - (sceneSize.height - matrixSize) / 2 + constants.insets });
  self.$addChild(sloganNode);

  // Score nodes
  var scoreSize = { width: 85, height: 45 };
  var scoreNode = ScoreNode.$alloc().$initWithText_size("SCORE", scoreSize);
  scoreNode.$setPosition({ x: sceneRect.width - scoreSize.width * 1.5 - constants.insets * 1.5, y: sceneSize.height - scoreSize.height / 2 - constants.insets });
  self.$addChild(scoreNode);
  self.$setScoreNode(scoreNode);

  var bestNode = ScoreNode.$alloc().$initWithText_size("BEST", scoreSize);
  bestNode.$setPosition({ x: sceneRect.width - scoreSize.width / 2 - constants.insets, y: sceneSize.height - scoreSize.height / 2 - constants.insets });
  bestNode.$setNumber($cache.get("best-score") || 0);
  self.$addChild(bestNode);
  self.$setBestNode(bestNode);

  // Button nodes
  var btnColor = constants.colors.orange;
  var btnSize = { width: matrixSize, height: 40 };
  var newBtnNode = ButtonNode.$alloc().$initWithColor_size_title_target_action_(btnColor, btnSize, "NEW GAME", self, "newGameBtnTapped:");
  newBtnNode.$setPosition({ x: btnSize.width / 2 + constants.insets, y: constants.insets + btnSize.height / 2 });
  self.$addChild(newBtnNode);

  // Swipe gestures
  var directions = [1 << 0, 1 << 1, 1 << 2, 1 << 3];
  directions.forEach(function(direction) {
    view.$addGestureRecognizer(builder.gesture(self, "swipeEvent:", direction));
  });
}

function swipeEvent(recognizer) {
  var rect = self.$matrixRect();
  var view = recognizer.$view();
  var location = recognizer.$locationInView(view);
  if (helper.pointInRect(location, rect)) {
    var direction = Math.floor(Math.log2(recognizer.$direction()));
    self.$matrixNode().$swipeTo(direction);
  }
}

function scoreChanged(score) {

  var oldValue = self.$scoreNode().$number();
  var newValue = oldValue + score;
  self.$scoreNode().$setNumber(newValue);

  var bestValue = self.$bestNode().$number();
  if (newValue > bestValue) {
    self.$bestNode().$setNumber(newValue);
    $cache.set("best-score", newValue);
  }
}

function newGameBtnTapped(sender) {
  var matrixNode = self.$matrixNode();
  matrixNode.$newGame();
  var scoreNode = self.$scoreNode();
  scoreNode.$setNumber(0);
}

function didFinish(flag) {
  var size = self.$size();
  var scene = $objc("GameOverScene").$alloc().$initWithSize_flag(size, flag);
  var view = self.$view();
  var transition = SKTransition.$crossFadeWithDuration(0.4);
  view.$presentScene_transition(scene, transition);
}