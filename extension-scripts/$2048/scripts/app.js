var builder = require("./builder");

function init() {
  $ui.render({
    props: {
      bgcolor: $color("#faf8ef")
    },
    views: [
      {
        type: "view",
        layout: $layout.fill,
        events: {
          ready: function(sender) {
            $delay(0.01, function() {
              render(sender);
            });
          }
        }
      }
    ]
  });
}

function render(sender) {

  // Create SKView
  var rootView = sender.runtimeValue();

  var skView = $objc("SKView").$new();
  var frame = rootView.$frame();
  var size = {
    width: frame.width,
    height: frame.height - ($device.isIphoneX ? 28 : 0)
  };

  // skView.$setShowsFPS(true);
  // skView.$setShowsNodeCount(true);
  skView.$setFrame({ x: 0, y: 0, width: size.width, height: size.height });
  rootView.$addSubview(skView);

  // Create scene
  var scene = MainScene.$alloc().$initWithSize(size);
  skView.$presentScene(scene);
}

module.exports = {
  init: init
}