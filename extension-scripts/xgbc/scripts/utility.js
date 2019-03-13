exports.isDebugMode = () => {
  return $objc("BBEngine").$shared().$debug();
}

exports.removeExtension = path => {
  return path.split(".").slice(0, -1).join(".");
}

exports.hash = path => {
  return $text.MD5(path);
}

exports.showBlinkEffect = view => {
  $ui.animate({
    duration: 0.3,
    animation: function() {
      view.bgcolor = $rgba(200, 200, 200, 0.1);
    },
    completion: function() {
      $ui.animate({
        duration: 0.3,
        animation: function() {
          view.bgcolor = $color("white");
        }
      });
    }
  });
}

exports.setSwipeBackEnabled = enabled => {
  let navigationVC = $ui.controller.runtimeValue().$navigationController();
  let recognizer = navigationVC.$interactivePopGestureRecognizer();
  recognizer.$setEnabled(enabled);
}