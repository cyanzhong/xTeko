$ui.render({
  views: [
    {
      type: "button",
      props: {
        title: "Resize",
      },
      layout: (make, view) => {
        make.center.equalTo(view.super);
        make.size.equalTo($size(100, 32));
      },
      events: {
        tapped: sender => {
          sender.updateLayout(make => {
            make.size.equalTo($size(200, 64));
          });
          $ui.animate({
            duration: 0.4,
            damping: 0.5,
            velocity: 1.0,
            animation: function() {
              sender.relayout(); 
            }
          })
        }
      }
    }
  ]
})