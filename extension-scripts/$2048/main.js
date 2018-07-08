// Load framework
var loader = require("./scripts/framework-loader");
loader.load("/System/Library/Frameworks/SpriteKit.framework");

// Define classes
require("./scripts/rect-node");
require("./scripts/button-node");
require("./scripts/matrix-item");
require("./scripts/matrix-node");
require("./scripts/score-node");
require("./scripts/main-scene");
require("./scripts/gameover-scene");

// Load classes
$objc("SKAction");
$objc("SKTransition");
$objc("MainScene");
$objc("ScoreNode");
$objc("ButtonNode");

// Init app
var app = require('./scripts/app');
app.init();