const constants = require("./constants");
const dispatcher = require("./dispatcher");
const joystick = require("./joystick");

joystick.$setKeyDownHandler(keyCode => {
  let btn = $(keyCode.rawValue());
  if (btn) {
    btn.alpha = 0.4;
    dispatcher.$keyDown(keyCode);
  } else {
    resetKeys();
  }
});

joystick.$setKeyUpHandler(keyCode => {
  let btn = $(keyCode.rawValue());
  if (btn) {
    btn.alpha = 1.0;
    dispatcher.$keyUp(keyCode);
  } else {
    resetKeys();
  }
});

function resetKeys() {
  dispatcher.$resetKeys();

  let views = $("joystick").views;
  views.forEach(view => view.alpha = 1.0);
}

exports.loadGame = path => {
  $ui.push({
    props: {
      clipsToSafeArea: true,
      homeIndicatorHidden: true
    },
    views: [
      {
        type: "view",
        props: {
          id: "container"
        },
        layout: $layout.fill,
        views: [
          {
            type: "web",
            props: {
              id: "console",
              url: "http://localhost:1010/index.html",
              scrollEnabled: false,
              showsProgress: false
            },
            events: {
              didFinish: sender => {
                sender.eval({"script": `initGame('./roms/${path}')`});
              }
            }
          }
        ],
        events: {
          layoutSubviews: sender => {
            let view = $("console");
            let frame = sender.frame;
            if (frame.width > frame.height) {
              let height = frame.height;
              let width = Math.floor(height * 256 / 240);
              view.frame = $rect((frame.width - width) / 2, (frame.height - height) / 2, width, height);
            } else {
              let width = frame.width;
              let height = Math.floor(width * 240 / 256);
              view.frame = $rect((frame.width - width) / 2, constants.btnSize.startSelect.height + constants.btnMargin * 2, width, height);
            }
          }
        }
      },
      {
        type: "runtime",
        props: {
          id: "joystick",
          view: joystick
        },
        layout: (make, view) => {
          make.left.equalTo(constants.btnMargin);
          make.bottom.inset(constants.bottomInset);
          let width = (constants.btnSize.leftRight.width * 2 + constants.btnSize.upDown.width);
          make.size.equalTo($size(width, width));
        },
        views: [
          {
            type: "button",
            props: {
              id: "L",
              title: "←",
              font: constants.font.large,
              smoothRadius: constants.btnRadius,
              bgcolor: constants.color.black,
              userInteractionEnabled: false
            },
            layout: (make, view) => {
              make.left.equalTo(0);
              make.centerY.equalTo(view.super);
              make.size.equalTo(constants.btnSize.leftRight);
            }
          },
          {
            type: "button",
            props: {
              id: "R",
              title: "→",
              font: constants.font.large,
              smoothRadius: constants.btnRadius,
              bgcolor: constants.color.black,
              userInteractionEnabled: false
            },
            layout: (make, view) => {
              make.right.equalTo(0);
              make.centerY.equalTo(view.super);
              make.size.equalTo(constants.btnSize.leftRight);
            }
          },
          {
            type: "button",
            props: {
              id: "U",
              title: "↑",
              font: constants.font.large,
              smoothRadius: constants.btnRadius,
              bgcolor: constants.color.black,
              userInteractionEnabled: false
            },
            layout: (make, view) => {
              make.top.equalTo(0);
              make.centerX.equalTo(view.super);
              make.size.equalTo(constants.btnSize.upDown);
            }
          },
          {
            type: "button",
            props: {
              id: "D",
              title: "↓",
              font: constants.font.large,
              smoothRadius: constants.btnRadius,
              bgcolor: constants.color.black,
              userInteractionEnabled: false
            },
            layout: (make, view) => {
              make.bottom.equalTo(0);
              make.centerX.equalTo(view.super);
              make.size.equalTo(constants.btnSize.upDown);
            }
          },
          {
            type: "button",
            props: {
              id: "LU",
              title: "↖",
              font: constants.font.large,
              bgcolor: constants.color.clear,
              titleColor: constants.color.lightGray,
              userInteractionEnabled: false
            },
            layout: (make, view) => {
              make.top.left.equalTo(0);
              let width = constants.btnSize.leftRight.width;
              make.size.equalTo($size(width, width));
            }
          },
          {
            type: "button",
            props: {
              id: "RU",
              title: "↗",
              font: constants.font.large,
              bgcolor: constants.color.clear,
              titleColor: constants.color.lightGray,
              userInteractionEnabled: false
            },
            layout: (make, view) => {
              make.top.right.equalTo(0);
              let width = constants.btnSize.leftRight.width;
              make.size.equalTo($size(width, width));
            }
          },
          {
            type: "button",
            props: {
              id: "LD",
              title: "↙",
              font: constants.font.large,
              bgcolor: constants.color.clear,
              titleColor: constants.color.lightGray,
              userInteractionEnabled: false
            },
            layout: (make, view) => {
              make.left.bottom.equalTo(0);
              let width = constants.btnSize.leftRight.width;
              make.size.equalTo($size(width, width));
            }
          },
          {
            type: "button",
            props: {
              id: "RD",
              title: "↘",
              font: constants.font.large,
              bgcolor: constants.color.clear,
              titleColor: constants.color.lightGray,
              userInteractionEnabled: false
            },
            layout: (make, view) => {
              make.right.bottom.equalTo(0);
              let width = constants.btnSize.leftRight.width;
              make.size.equalTo($size(width, width));
            }
          }
        ]
      },
      {
        type: "view",
        layout: (make, view) => {
          make.top.right.inset(constants.btnMargin);
          make.size.equalTo($size(constants.btnSize.startSelect.width * 2 + 10, constants.btnSize.startSelect.height));
        },
        views: [
          {
            type: "button",
            props: {
              id: "select-btn",
              title: "SELECT",
              font: constants.font.normal,
              smoothRadius: constants.btnRadius,
              bgcolor: constants.color.gray
            },
            layout: (make, view) => {
              make.left.top.bottom.equalTo(0);
              make.width.equalTo(constants.btnSize.startSelect.width);
            }
          },
          {
            type: "button",
            props: {
              id: "start-btn",
              title: "START",
              font: constants.font.normal,
              smoothRadius: constants.btnRadius,
              bgcolor: constants.color.gray
            },
            layout: (make, view) => {
              make.right.top.bottom.equalTo(0);
              make.width.equalTo(constants.btnSize.startSelect.width);
            }
          }
        ]
      },
      {
        type: "view",
        layout: (make, view) => {
          make.right.inset(constants.btnMargin);
          make.bottom.inset(constants.bottomInset);
          make.size.equalTo($size(constants.btnSize.ab.width * 2 + constants.btnMargin, constants.btnSize.ab.height));
        },
        views: [
          {
            type: "button",
            props: {
              id: "b-btn",
              title: "B",
              font: constants.font.large,
              radius: constants.btnSize.ab.width * 0.5,
              bgcolor: constants.color.red
            },
            layout: (make, view) => {
              make.left.top.bottom.equalTo(0);
              make.width.equalTo(constants.btnSize.ab.width);
            }
          },
          {
            type: "button",
            props: {
              id: "a-btn",
              title: "A",
              font: constants.font.large,
              radius: constants.btnSize.ab.width * 0.5,
              bgcolor: constants.color.red
            },
            layout: (make, view) => {
              make.right.top.bottom.equalTo(0);
              make.width.equalTo(constants.btnSize.ab.width);
            }
          }
        ]
      }
    ]
  });

  let ids = ["select-btn", "start-btn", "b-btn", "a-btn"];
  for (const id of ids) {
    let btn = $(id).runtimeValue();
    btn.$addTarget_action_forControlEvents(dispatcher, "touchDown:", (1 << 0));
    btn.$addTarget_action_forControlEvents(dispatcher, "touchUp:", (1 << 6) | (1 << 7) | (1 << 3) | (1 << 5) | 1 << 8);
  }
}