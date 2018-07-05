var builder = require("./builder");
var helper = require("./helper");
var constants = require("./constants");

$define({
  type: "MatrixNode: SKSpriteNode",
  props: [
    "itemSize",
    "sweepAudioNode",
    "sumAudioNode",
    "eventHandler",
  ],
  events: {
    setup: setup,
    swipeTo: swipeTo,
    newGame: newGame,
  }
});

var counter = null;
var items = null;
var vector = {
  x: [[0, 0, 3, 0], [1, 1, -1, 1]],
  y: [[3, 0, 0, 0], [-1, 1, 1, 1]],
  p: [[0, 0, 1, -1], [1, -1, 0, 0]],
}
var maxChildrenNumber = 18;

function setup() {

  // Reset
  counter = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  items = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];

  // Audio nodes
  var sweepAudioNode = builder.audioNode("sfx_sweep.mp3");
  self.invoke("addChild", sweepAudioNode);
  self.invoke("setSweepAudioNode", sweepAudioNode);

  var sumAudioNode = builder.audioNode("sfx_sum.mp3");
  self.invoke("addChild", sumAudioNode);
  self.invoke("setSumAudioNode", sumAudioNode);

  var size = self.invoke("size");
  var length = (size.width - constants.insets * 5) / 4;
  var itemSize = { width: length, height: length };
  self.invoke("setItemSize", itemSize);

  // Create 2 items as initial state
  createItem();
  createItem();
}

function createItem() {
  
  var r;
  var c;
  var size = self.invoke("itemSize");
  var count = self.invoke("children.count");

  do {
    r = Math.floor(Math.random() * 4);
    c = Math.floor(Math.random() * 4);
  } while (counter[r][c] != 0 && count < maxChildrenNumber);

  if (count >= maxChildrenNumber) {
    return;
  }

  var number = Math.floor(Math.random() * 2) > 0 ? 2 : 4;
  var node = $objc("MatrixItem").invoke("alloc.initWithNumber:size:", number, size);
  node.invoke("setPosition", nodePosition(r, c));
  node.invoke("showIn", self);

  counter[r][c] = number;
  items[r][c] = node;
}

function swipeTo(direction) {

  moveTo(direction);

  if (combineTo(direction)) {
    helper.playAudio(self.invoke("sumAudioNode"));
  }

  moveTo(direction);
  createItem();

  // Play audio
  helper.playAudio(self.invoke("sweepAudioNode"));

  if (gameOver()) {
    self.invoke("eventHandler.didFinish", false);
  }
}

function moveTo(direction) {

  var idx = direction;
  var vx = vector.x;
  var vy = vector.y;
  var vp = vector.p;

  for (var r=vx[0][idx]; r<4&&r>=0; r+=vx[1][idx]) {
    
    for (var c=vy[0][idx]; c<4&&c>=0; c+=vy[1][idx]) {

      var nr = r + vp[0][idx];
      var nc = c + vp[1][idx];

      while (inrange(nr, nc) && counter[nr][nc] == 0) {
        nr += vp[0][idx];
        nc += vp[1][idx];
      }

      nr -= vp[0][idx];
      nc -= vp[1][idx];

      if (inrange(nr, nc) && (nr != r || nc != c) && counter[r][c] != 0) {

        var position = nodePosition(nr, nc);
        var item = items[r][c];

        items[r][c].invoke("moveTo", position);
        items[nr][nc] = items[r][c];
        items[r][c] = null;

        counter[nr][nc] = counter[r][c];
        counter[r][c] = 0;
      }
    }
  }
}

function combineTo(direction) {

  var idx = direction;
  var vx = vector.x;
  var vy = vector.y;
  var vp = vector.p;
  var result = false;

  for (var i=vx[0][idx]; i<4&&i>=0; i+=vx[1][idx]) {

    for (var j=vy[0][idx]; j<4&&j>=0; j+=vy[1][idx]) {

      var nr = i + vp[0][idx];
      var nc = j + vp[1][idx];
      var matched = inrange(nr, nc) && counter[i][j] == counter[nr][nc] && items[nr][nc];

      if (matched) {

        result = true;
        items[nr][nc].invoke("double");
        items[i][j].invoke("removeFromParent");
        items[i][j] = null;

        var score = counter[nr][nc] * 2;
        counter[nr][nc] = score;
        counter[i][j] = 0;
        
        self.invoke("eventHandler.scoreChanged", score);

        // You win
        if (score >= 2048) {
          self.invoke("eventHandler.didFinish", true);
        }
      }
    }
  }

  return result;
}

function gameOver() {

  for (var i=0; i<4; ++i) {
    for (var j=0; j<4; ++j) {
      var r = i + 1;
      var c = j + 1;
      var x = (inrange(r, j) && counter[i][j] == counter[r][j]);
      var y = (inrange(i, c) && counter[i][j] == counter[i][c]);
      if (x || y) {
        return false;
      }
    }
  }

  return self.invoke("children.count") >= maxChildrenNumber;
}

function inrange(x, y) {
  return (x >= 0 && x < 4 && y >= 0 && y < 4)
}

function nodePosition(row, col) {
  var size = self.invoke("size");
  var itemSize = self.invoke("itemSize");
  var inset = constants.insets;
  var x = -size.width * 0.5 + itemSize.width * 0.5 + inset + col * (itemSize.width + inset);
  var y = -size.height * 0.5 + itemSize.height * 0.5 + inset + row * (itemSize.height + inset);
  return { x: x, y: y };
}

function newGame() {
  self.invoke("removeAllChildren");
  setup();
}