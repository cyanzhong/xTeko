let lottie = {
  type: "lottie",
  props: {
    src: "assets/lottie.json",
    loop: true,
    contentMode: $contentMode.scaleAspectFit
  },
  layout: (make, view) => {
    make.left.top.right.inset(10);
    make.height.equalTo(360);
  },
  events: {
    ready: sender => sender.play()
  }
};

let controls = {
  type: "view",
  layout: (make, view) => {
    make.top.equalTo($("lottie").bottom);
    make.left.bottom.right.equalTo(0);
  },
  views: [
    {
      type: "button",
      props: {
        title: "Play",
        id: "play-btn"
      },
      layout: (make, view) => {
        make.top.equalTo(10);
        make.left.equalTo(40);
        make.height.equalTo(36);
        make.width.equalTo(view.super).multipliedBy(1.0 / 3).offset(-100.0 / 3);
      },
      events: {
        tapped: () => $("lottie").play()
      }
    },
    {
      type: "button",
      props: {
        title: "Pause",
        id: "pause-btn"
      },
      layout: (make, view) => {
        make.top.equalTo(10);
        make.left.equalTo($("play-btn").right).offset(10);
        make.width.equalTo($("play-btn"));
        make.height.equalTo(36);
      },
      events: {
        tapped: () => $("lottie").pause()
      }
    },
    {
      type: "button",
      props: {
        title: "Stop"
      },
      layout: (make, view) => {
        make.top.equalTo(10);
        make.left.equalTo($("pause-btn").right).offset(10);
        make.width.equalTo($("pause-btn"));
        make.height.equalTo(36);
      },
      events: {
        tapped: () => $("lottie").stop()
      }
    },
    {
      type: "slider",
      layout: (make, view) => {
        make.left.right.inset(40);
        make.top.equalTo(56);
      },
      events: {
        changed: sender => $("lottie").progress = sender.value
      }
    }
  ]
};

$ui.render({
  props: {
    title: "Lottie Example",
    navButtons: [
      {
        title: "QRCode",
        handler: async () => {
          let url = await $qrcode.scan();
          let { data } = await $http.get(url);
          $("lottie").json = data;
          $("lottie").loop = true;
          $("lottie").play();
        }
      }
    ]
  },
  views: [lottie, controls]
});