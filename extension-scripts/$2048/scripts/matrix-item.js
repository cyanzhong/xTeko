var builder = require("./builder");

$define({
  type: "MatrixItem: RectNode",
  props: [
    "number",
    "labelNode",
  ],
  events: {
    "initWithNumber:size": function(number, size) {
      return init(self, number, size);
    },
    "updateNumber": updateNumber,
    "showIn": showIn,
    "moveTo": moveTo,
    "double": double,
    "remove": remove
  }
});

var itemColors = [
  "#000000", // dummy
  "#eee4da", // 2
  "#ede0c8", // 4
  "#f2b179", // 8
  "#f59563", // 16
  "#f67c5f", // 32
  "#f65e3b", // 64
  "#edcf72", // 128
  "#edcc61", // 256
  "#edc850", // 512
  "#edc53f", // 1024
  "#edc22e"  // 2048!
];

var fontColors = [
  "#776e65", // 2 ~ 4
  "#f9f6f2", // 8 ~ 2048
]

function init(self, number, size) {

  var index = Math.floor(Math.log2(number));
  self = self.$super().$initWithColor_size(builder.color(itemColors[index]), size);
  self.$setSize(size);

  // Label
  var labelNode = builder.labelNode(number.toString(), 30);
  self.$addChild(labelNode);
  self.$setLabelNode(labelNode);

  updateNumber(number);

  return self;
}

function updateNumber(number) {

  var index = Math.floor(Math.log2(number));
  var shapeNode = self.$shapeNode();
  var itemColor = builder.color(itemColors[index]);
  shapeNode.$setStrokeColor(itemColor);
  shapeNode.$setFillColor(itemColor);

  var labelNode = self.$labelNode();
  labelNode.$setText(number.toString());
  labelNode.$setFontColor(builder.color(number <= 4 ? fontColors[0] : fontColors[1]));

  self.$setNumber(number);
}

function showIn(node) {
  node.$addChild(self);
  self.$setScale(0.2);
  var action = SKAction.$scaleTo_duration(1.0, 0.15);
  self.$runAction(action);
}

function moveTo(position) {
  var action = SKAction.$moveTo_duration(position, 0.15);
  action.$setTimingMode(3);
  self.$runAction(action);
}

function double() {

  var number = self.$number();
  updateNumber(number * 2);

  function createAction(scale, duration) {
    return SKAction.$scaleTo_duration(scale, duration);
  }

  var act1 = createAction(1.2, 0.05);
  var act2 = createAction(0.9, 0.02);
  var act3 = createAction(1.0, 0.06);
  
  var actions = NSMutableArray.$array();
  actions.$addObject(act1);
  actions.$addObject(act2);
  actions.$addObject(act3);

  var sequence = SKAction.$sequence(actions);
  self.$runAction(sequence);
}

function remove() {
  var action = SKAction.$fadeOutWithDuration(0.15);
  var node = self;
  node.$runAction_completion(action, $block("void, void", function() {
    node.$removeFromParent();
  }));
}