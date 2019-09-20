const constants = require("./constants");
const utility = require("./utility");
const joystick = require("./joystick");
const buttons = require("./buttons");
const dispatcher = require("./dispatcher");
const keyboard = require("./keyboard");
const builder = require("./builder");
const settings = require("./settings");
const props = builder.props;

exports.loadFile = (path, command) => {
  let keys = require("./fn").keys();
  $ui.push({
    props: {
      title: utility.removeExtension(path),
      clipsToSafeArea: true,
      navButtons: [
        {
          icon: "010",
          handler: () => {
            let screen = $device.info.screen;
            if (!$device.isIpad && screen.width > screen.height) {
              $ui.error($l10n("KEYBOARD_UNAVAILABLE"));
              return;
            }

            let handler = $("key-input");
            handler.focus();
          }
        }
      ]
    },
    views: [
      {
        type: "runtime",
        props: {
          id: "key-input",
          view: keyboard.new()
        },
        layout: (make, view) => {
          make.left.top.equalTo(0);
          make.size.equalTo($size(0, 0));
        }
      },
      {
        type: "view",
        layout: $layout.fill,
        events: {
          layoutSubviews: sender => {
            let canvas = $("canvas");
            let joystick = $("joystick");
            let buttons = $("buttons");
            let fn1 = $("FN1");
            let fn2 = $("FN2");
            let fn3 = $("FN3");
            let fn4 = $("FN4");
            let fn5 = $("FN5");
            let fn6 = $("FN6");
            let fn7 = $("FN7");
            let fn8 = $("FN8");

            let frame = sender.frame;
            let landscapeMode = frame.width > frame.height;
            let topInset = constants.extendedEdgeInset;
            let bottomInset = landscapeMode ? constants.btnInsetLandscape : constants.btnInsetPortrait;
            let fnBtnInset = landscapeMode ? (constants.btnMargin * 0.5) : 5;
            let fnBtnHeight = 28;
            var scale;
  
            if (landscapeMode) {
              $("key-input").blur();

              scale = Math.min(1.0, (frame.height - ($device.isIphoneX ? 40 : 70) - topInset) / 400);
              canvas.scale(scale);
              canvas.frame = $rect(
                (frame.width - 640 * scale) * 0.5,
                (frame.height - 400 * scale) * 0.5,
                640,
                400
              );
            } else {
              scale = Math.min(1.0, frame.width / 640);
              canvas.scale(scale);
              canvas.frame = $rect(
                (frame.width - 640 * scale) * 0.5,
                0,
                640,
                400
              );
            }

            $("spinner").frame = (() => {
              let rect = $("spinner").frame;
              return $rect(
                (frame.width - rect.width) * 0.5,
                canvas.frame.y + canvas.frame.height * scale * 0.5 - rect.height * 0.5,
                rect.width,
                rect.height
              );
            })();

            var joystickSize = constants.btnSize.leftRight.width * 2 + constants.btnSize.upDown.width + constants.btnMargin * 2;
            var buttonSize = joystickSize;
            
            if (landscapeMode) {
              let fnBtnOffset = $device.isIphoneX ? 0 : fnBtnInset;
              let fnBtnWidth = ((frame.width - canvas.frame.width * scale) * 0.5 - fnBtnInset * 2 - fnBtnOffset) * 0.5;
              var fnBtnX = fnBtnOffset;
              var fnBtnY = canvas.frame.y;

              fn1.frame = $rect(fnBtnX, fnBtnY, fnBtnWidth, fnBtnHeight);
              fn2.frame = $rect(fnBtnX + fnBtnInset + fnBtnWidth, fnBtnY, fnBtnWidth, fnBtnHeight);
              fn3.frame = $rect(fnBtnX, fnBtnY + fnBtnInset + fnBtnHeight, fnBtnWidth, fnBtnHeight);
              fn4.frame = $rect(fnBtnX + fnBtnInset + fnBtnWidth, fnBtnY + fnBtnInset + fnBtnHeight, fnBtnWidth, fnBtnHeight);

              fn5.frame = $rect(frame.width - fnBtnX - fnBtnWidth * 2 - fnBtnInset, fnBtnY, fnBtnWidth, fnBtnHeight);
              fn6.frame = $rect(frame.width - fnBtnX - fnBtnWidth, fnBtnY, fnBtnWidth, fnBtnHeight);
              fn7.frame = $rect(frame.width - fnBtnX - fnBtnWidth * 2 - fnBtnInset, fnBtnY + fnBtnInset + fnBtnHeight, fnBtnWidth, fnBtnHeight);
              fn8.frame = $rect(frame.width - fnBtnX - fnBtnWidth, fnBtnY + fnBtnInset + fnBtnHeight, fnBtnWidth, fnBtnHeight);

              joystick.frame = (() => {
                joystickSize *= (constants.compactMode && !$device.isIphoneX) ? 0.9 : 1.0;
                return $rect(
                  fn1.frame.x + fn1.frame.width + fnBtnInset * 0.5 - joystickSize * 0.5,
                  frame.height - joystickSize + constants.btnMargin - fn1.frame.y,
                  joystickSize,
                  joystickSize
                );
              })();
              
              buttons.frame = (() => {
                buttonSize *= (constants.compactMode && !$device.isIphoneX) ? 0.9 : 1.0;
                return $rect(
                  fn5.frame.x + fn5.frame.width + fnBtnInset * 0.5 - buttonSize * 0.5,
                  frame.height - buttonSize + constants.btnMargin - fn1.frame.y,
                  buttonSize,
                  buttonSize
                );
              })();
            } else {
              let fnBtnWidth = (frame.width - 5 * fnBtnInset) / 4;
              var fnBtnX = fnBtnInset;
              var fnBtnY = canvas.frame.y + canvas.frame.height * scale + fnBtnInset;

              function nextRect() {
                fnBtnX += fnBtnInset + fnBtnWidth;
                return $rect(fnBtnX, fnBtnY, fnBtnWidth, fnBtnHeight);
              }

              fn1.frame = $rect(fnBtnX, fnBtnY, fnBtnWidth, fnBtnHeight);
              fn2.frame = nextRect();
              fn3.frame = nextRect();
              fn4.frame = nextRect();

              fnBtnX = fnBtnInset;
              fnBtnY += fnBtnInset + fnBtnHeight;
              fn5.frame = $rect(fnBtnX, fnBtnY, fnBtnWidth, fnBtnHeight);
              fn6.frame = nextRect();
              fn7.frame = nextRect();
              fn8.frame = nextRect();

              joystick.frame = (() => {
                return $rect(
                  0,
                  frame.height - joystickSize - bottomInset + constants.btnMargin,
                  joystickSize,
                  joystickSize
                );
              })();
              
              buttons.frame = (() => {
                return $rect(
                  frame.width - buttonSize,
                  joystick.frame.y + joystick.frame.height * 0.5 - buttonSize * 0.5,
                  buttonSize,
                  buttonSize
                );
              })();
            }
          }
        },
        views: [
          {
            type: "web",
            props: {
              id: "canvas",
              url: `http://localhost:${constants.port}/index.html`,
              showsProgress: false,
              scrollEnabled: false,
              hidden: true
            },
            events: {
              didFinish: sender => {
                let name = utility.removeExtension(path);
                let folder = settings.getFolder(path);
                let script = `initDosBox('${path}', '${folder}', '${command}')`;
                sender.eval({"script": script});
              },
              didMount: () => {
                let spinner = $("spinner");
                if (spinner) {
                  spinner.loading = false;
                }

                let canvas = $("canvas");
                if (canvas) {
                  canvas.hidden = false;
                }
              }
            }
          },
          {
            type: "spinner",
            props: {
              id: "spinner",
              style: 0,
              color: $color("gray"),
              loading: true
            }
          },
          {
            type: "button",
            props: props.grayButton("FN1", keys[0].name)
          },
          {
            type: "button",
            props: props.grayButton("FN2", keys[1].name)
          },
          {
            type: "button",
            props: props.grayButton("FN3", keys[2].name)
          },
          {
            type: "button",
            props: props.grayButton("FN4", keys[3].name)
          },
          {
            type: "button",
            props: props.grayButton("FN5", keys[4].name)
          },
          {
            type: "button",
            props: props.grayButton("FN6", keys[5].name)
          },
          {
            type: "button",
            props: props.grayButton("FN7", keys[6].name)
          },
          {
            type: "button",
            props: props.grayButton("FN8", keys[7].name)
          },
          {
            type: "runtime",
            props: {
              id: "joystick",
              view: (() => {
                joystick.$removeAllSubviews();
                return joystick;
              })()
            },
            views: [
              {
                type: "view",
                layout: (make, view) => {
                  let margin = constants.btnMargin;
                  let insets = $insets(margin, margin, margin, margin);
                  make.edges.equalTo(view.super).insets(insets);
                },
                views: [
                  {
                    type: "label",
                    props: props.blackButton("LEFT", "←"),
                    layout: (make, view) => {
                      make.left.equalTo(0);
                      make.centerY.equalTo(view.super);
                      make.width.equalTo(view.super).multipliedBy(0.35);
                      make.height.equalTo(view.super).multipliedBy(0.3);
                    }
                  },
                  {
                    type: "label",
                    props: props.blackButton("RIGHT", "→"),
                    layout: (make, view) => {
                      make.right.equalTo(0);
                      make.centerY.equalTo(view.super);
                      make.width.equalTo(view.super).multipliedBy(0.35);
                      make.height.equalTo(view.super).multipliedBy(0.3);
                    }
                  },
                  {
                    type: "label",
                    props: props.blackButton("UP", "↑"),
                    layout: (make, view) => {
                      make.top.equalTo(0);
                      make.centerX.equalTo(view.super);
                      make.width.equalTo(view.super).multipliedBy(0.3);
                      make.height.equalTo(view.super).multipliedBy(0.35);
                    }
                  },
                  {
                    type: "label",
                    props: props.blackButton("DOWN", "↓"),
                    layout: (make, view) => {
                      make.bottom.equalTo(0);
                      make.centerX.equalTo(view.super);
                      make.width.equalTo(view.super).multipliedBy(0.3);
                      make.height.equalTo(view.super).multipliedBy(0.35);
                    }
                  }
                ]
              }
            ]
          },
          {
            type: "runtime",
            props: {
              id: "buttons",
              view: (() => {
                buttons.$removeAllSubviews();
                return buttons;
              })()
            },
            views: [
              {
                type: "view",
                layout: (make, view) => {
                  let margin = constants.btnMargin;
                  let insets = $insets(margin, margin, margin, margin);
                  make.edges.equalTo(view.super).insets(insets);
                },
                views: [
                  {
                    type: "label",
                    props: props.redButton("ESC"),
                    layout: (make, view) => {
                      make.left.top.right.equalTo(0);
                      make.height.equalTo(view.super).multipliedBy(0.33).offset(-constants.btnMargin * 0.5);
                    }
                  },
                  {
                    type: "label",
                    props: props.redButton("SPACE"),
                    layout: (make, view) => {
                      make.left.right.equalTo(0);
                      make.centerY.equalTo(view.super);
                      make.height.equalTo(view.super).multipliedBy(0.33).offset(-constants.btnMargin * 0.5);
                    }
                  },
                  {
                    type: "label",
                    props: props.redButton("ENTER"),
                    layout: (make, view) => {
                      make.left.bottom.right.equalTo(0);
                      make.height.equalTo(view.super).multipliedBy(0.33).offset(-constants.btnMargin * 0.33);
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    events: {
      appeared: () => {
        utility.setSwipeBackEnabled(false);
      },
      disappeared: () => {
        utility.setSwipeBackEnabled(true);
        let navigator = $ui.controller.runtimeValue().$navigationController();
        let count = navigator.$viewControllers().$count();
        if (count <= 1) {
          utility.destroyDosBox();
        }
      }
    }
  });

  bindButtons(["FN1", "FN2", "FN3", "FN4", "FN5", "FN6", "FN7", "FN8"]);
}

function bindButtons(ids) {
  ids.forEach(id => {
    let btn = $(id).runtimeValue();
    btn.$addTarget_action_forControlEvents(dispatcher, "fnDown:", (1 << 0));
    btn.$addTarget_action_forControlEvents(dispatcher, "fnUp:", (1 << 6) | (1 << 7) | (1 << 3) | (1 << 5) | 1 << 8);
  });
}