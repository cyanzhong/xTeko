// Load framework
var loader = require("./scripts/framework-loader");
loader.load("/System/Library/Frameworks/SpriteKit.framework");

// Load classes
require("./scripts/rect-node");
require("./scripts/button-node");
require("./scripts/matrix-item");
require("./scripts/matrix-node");
require("./scripts/score-node");
require("./scripts/main-scene");
require("./scripts/gameover-scene");

// Init app
var app = require('./scripts/app');
app.init();