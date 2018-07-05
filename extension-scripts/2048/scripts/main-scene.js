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
      if (!self.invoke("created")) {
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
  
  self.invoke("setScaleMode", 2);
  self.invoke("setBackgroundColor", constants.colors.backgroud);
  self.invoke("setCreated", true);

  var view = self.invoke("view");
  var sceneRect = self.invoke("frame");
  var sceneSize = { width: sceneRect.width, height: sceneRect.height };

  var matrixSize = (sceneSize.width - constants.insets * 2);
  var matrixRect = {
    x: constants.insets,
    y: (sceneSize.height - matrixSize) / 2,
    width: matrixSize,
    height: matrixSize
  };

  self.invoke("setMatrixRect", matrixRect);

  // Matrix container
  var matrixContainer = builder.rect(matrixRect, 4, constants.colors.darkGray);
  self.invoke("addChild", matrixContainer);

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
      matrixContainer.invoke("addChild", node);
    }
  }

  // Matrix node
  var matrixNode = $objc("MatrixNode").invoke("new");
  matrixNode.invoke("setSize", { width: matrixSize, height: matrixSize });
  matrixNode.invoke("setPosition", { x: matrixSize / 2, y: matrixSize / 2 });
  matrixNode.invoke("setup");
  matrixNode.invoke("setEventHandler", self);
  matrixContainer.invoke("addChild", matrixNode);
  self.invoke("setMatrixNode", matrixNode);

  // Logo
  var logoNode = builder.labelNode("2048", 52, constants.colors.darkText, constants.fontNames.markerFeltWide);
  var logoRect = logoNode.invoke("frame");
  logoNode.invoke("setPosition", { x: logoRect.width / 2 + constants.insets, y: sceneSize.height - logoRect.height / 2 - constants.insets });
  self.invoke("addChild", logoNode);

  // Slogan
  var sloganNode = builder.labelNode("Join the numbers and get to the 2048 tile!", 13, constants.colors.lightText, constants.fontNames.lato);
  var sloganRect = sloganNode.invoke("frame");
  sloganNode.invoke("setPosition", { x: matrixSize / 2, y: sceneSize.height - (sceneSize.height - matrixSize) / 2 + constants.insets });
  self.invoke("addChild", sloganNode);

  // Score nodes
  var scoreSize = { width: 85, height: 45 };
  var scoreNode = $objc("ScoreNode").invoke("alloc.initWithText:size:", "SCORE", scoreSize);
  scoreNode.invoke("setPosition", { x: sceneRect.width - scoreSize.width * 1.5 - constants.insets * 1.5, y: sceneSize.height - scoreSize.height / 2 - constants.insets });
  self.invoke("addChild", scoreNode);
  self.invoke("setScoreNode", scoreNode);

  var bestNode = $objc("ScoreNode").invoke("alloc.initWithText:size:", "BEST", scoreSize);
  bestNode.invoke("setPosition", { x: sceneRect.width - scoreSize.width / 2 - constants.insets, y: sceneSize.height - scoreSize.height / 2 - constants.insets });
  bestNode.invoke("setNumber", $cache.get("best-score") || 0);
  self.invoke("addChild", bestNode);
  self.invoke("setBestNode", bestNode);

  // Button nodes
  var btnColor = constants.colors.orange;
  var btnSize = { width: matrixSize, height: 40 };
  var newBtnNode = $objc("ButtonNode").invoke("alloc.initWithColor:size:title:target:action:", btnColor, btnSize, "NEW GAME", self, "newGameBtnTapped:");
  newBtnNode.invoke("setPosition", { x: btnSize.width / 2 + constants.insets, y: constants.insets + btnSize.height / 2 });
  self.invoke("addChild", newBtnNode);

  // Swipe gestures
  var directions = [1 << 0, 1 << 1, 1 << 2, 1 << 3];
  directions.forEach(function(direction) {
    view.invoke("addGestureRecognizer", builder.gesture(self, "swipeEvent:", direction));
  });
}

function swipeEvent(recognizer) {
  var rect = self.invoke("matrixRect");
  var view = recognizer.invoke("view");
  var location = recognizer.invoke("locationInView", view);
  if (helper.pointInRect(location, rect)) {
    var direction = Math.floor(Math.log2(recognizer.invoke("direction")));
    self.invoke("matrixNode.swipeTo", direction);
  }
}

function scoreChanged(score) {

  var oldValue = self.invoke("scoreNode.number");
  var newValue = oldValue + score;
  self.invoke("scoreNode.setNumber", newValue);

  var bestValue = self.invoke("bestNode.number");
  if (newValue > bestValue) {
    self.invoke("bestNode.setNumber", newValue);
    $cache.set("best-score", newValue);
  }
}

function newGameBtnTapped(sender) {
  var matrixNode = self.invoke("matrixNode");
  matrixNode.invoke("newGame");
  var scoreNode = self.invoke("scoreNode");
  scoreNode.invoke("setNumber", 0);
}

function didFinish(flag) {
  var size = self.invoke("size");
  var scene = $objc("GameOverScene").invoke("alloc.initWithSize:flag:", size, flag);
  var view = self.invoke("view");
  var transition = $objc("SKTransition").invoke("crossFadeWithDuration", 0.4);
  view.invoke("presentScene:transition:", scene, transition);
}