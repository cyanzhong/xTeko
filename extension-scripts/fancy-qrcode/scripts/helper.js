exports.blinkView = view => {
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