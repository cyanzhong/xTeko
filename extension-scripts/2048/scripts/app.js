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

  var skView = $objc("SKView").invoke("new");
  var frame = rootView.invoke("frame");
  var size = {
    width: frame.width,
    height: frame.height - ($device.isIphoneX ? 28 : 0)
  };

  // skView.invoke("setShowsFPS", true);
  // skView.invoke("setShowsNodeCount", true);
  skView.invoke("setFrame", { x: 0, y: 0, width: size.width, height: size.height });
  rootView.invoke("addSubview", skView);

  // Create scene
  var scene = $objc("MainScene").invoke("alloc.initWithSize", size);
  skView.invoke("presentScene", scene);
}

module.exports = {
  init: init
}