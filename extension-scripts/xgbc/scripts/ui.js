const constants = require("./constants");
const dispatcher = require("./dispatcher");
const joystick = require("./joystick");
const buttons = require("./buttons");
const builder = require("./builder");
const utility = require("./utility");
const settings = require("./settings");
const props = builder.props;

exports.loadGame = path => {

  let hideKeypad = settings.hideKeypad();
  
  $ui.push({
    props: {
      title: utility.removeExtension(path),
      clipsToSafeArea: !hideKeypad,
      homeIndicatorHidden: true,
      navButtons: [
        {
          title: $l10n("STATES"),
          handler: () => stateBtnTapped(path)
        }
      ]
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
              id: "canvas",
              url: `http://localhost:${constants.port}/index.html`,
              scrollEnabled: false,
              showsProgress: false
            },
            events: {
              didFinish: sender => {
                let script = `initGame('./roms/${path}', ${settings.soundEnabled()})`;
                sender.eval({"script": script});
              }
            }
          }
        ],
        events: {
          layoutSubviews: sender => {
            let canvas = $("canvas");
            let joystick = $("joystick");
            let buttons = $("buttons");
            let selectStart = $("select-start");
            
            let frame = sender.frame;
            let landscapeMode = frame.width > frame.height;
            let topInset = constants.extendedEdgeInset;
            let bottomInset = landscapeMode ? constants.btnInsetLandscape : constants.btnInsetPortrait;

            if (landscapeMode) {
              // Landscape
              let height = frame.height - (hideKeypad ? 0 : constants.canvasBottomInset);
              let width = Math.floor(height * 160 / 144);

              canvas.frame = $rect(
                (frame.width - width) / 2,
                hideKeypad ? 0 : topInset,
                width,
                height
              );

              selectStart.frame = (() => {
                let size = $size(constants.btnSize.startSelect.width * 2 + 10, constants.btnSize.startSelect.height);
                return $rect(
                  frame.width - size.width - constants.btnMargin,
                  constants.btnMargin,
                  size.width,
                  size.height
                );
              })();
            } else {
              // Portrait
              let width = frame.width;
              let height = Math.floor(width * 144 / 160);

              canvas.frame = $rect(
                (frame.width - width) / 2,
                hideKeypad ? (frame.height - height) / 2 : constants.canvasTopInset,
                width,
                height
              );

              selectStart.frame = (() => {
                let size = $size(constants.btnSize.startSelect.width * 2 + 10, constants.btnSize.startSelect.height);
                return $rect(
                  (frame.width - size.width) / 2,
                  frame.height - size.height - constants.btnMargin,
                  size.width,
                  size.height
                )
              })();
            }

            joystick.frame = (() => {
              let size = constants.btnSize.leftRight.width * 2 + constants.btnSize.upDown.width + constants.btnMargin * 2;
              return $rect(
                0,
                frame.height - size - bottomInset + constants.btnMargin,
                size,
                size
              );
            })();
            
            buttons.frame = (() => {
              let width = constants.btnSize.ab.width * 2 + constants.btnMargin * 3;
              let height = width + constants.magicTouchHeight;
              return $rect(
                frame.width - width,
                frame.height - height - bottomInset + constants.btnMargin + constants.magicTouchHeight,
                width,
                height
              );
            })();
            
            canvas.eval({"script": `setSize(${canvas.frame.width}, ${canvas.frame.height})`});
          }
        }
      },
      {
        type: "runtime",
        props: {
          id: "joystick",
          hidden: hideKeypad,
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
                props: props.blackBtn("L", "←"),
                layout: (make, view) => {
                  make.left.equalTo(0);
                  make.centerY.equalTo(view.super);
                  make.size.equalTo(constants.btnSize.leftRight);
                }
              },
              {
                type: "label",
                props: props.blackBtn("R", "→"),
                layout: (make, view) => {
                  make.right.equalTo(0);
                  make.centerY.equalTo(view.super);
                  make.size.equalTo(constants.btnSize.leftRight);
                }
              },
              {
                type: "label",
                props: props.blackBtn("U", "↑"),
                layout: (make, view) => {
                  make.top.equalTo(0);
                  make.centerX.equalTo(view.super);
                  make.size.equalTo(constants.btnSize.upDown);
                }
              },
              {
                type: "label",
                props: props.blackBtn("D", "↓"),
                layout: (make, view) => {
                  make.bottom.equalTo(0);
                  make.centerX.equalTo(view.super);
                  make.size.equalTo(constants.btnSize.upDown);
                }
              },
              {
                type: "label",
                props: props.grayBtn("LU", "↖"),
                layout: (make, view) => {
                  make.top.left.equalTo(0);
                  let width = constants.btnSize.leftRight.width;
                  make.size.equalTo($size(width, width));
                }
              },
              {
                type: "label",
                props: props.grayBtn("RU", "↗"),
                layout: (make, view) => {
                  make.top.right.equalTo(0);
                  let width = constants.btnSize.leftRight.width;
                  make.size.equalTo($size(width, width));
                }
              },
              {
                type: "label",
                props: props.grayBtn("LD", "↙"),
                layout: (make, view) => {
                  make.left.bottom.equalTo(0);
                  let width = constants.btnSize.leftRight.width;
                  make.size.equalTo($size(width, width));
                }
              },
              {
                type: "label",
                props: props.grayBtn("RD", "↘"),
                layout: (make, view) => {
                  make.right.bottom.equalTo(0);
                  let width = constants.btnSize.leftRight.width;
                  make.size.equalTo($size(width, width));
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
          hidden: hideKeypad,
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
              let insets = $insets(margin, margin, margin + constants.magicTouchHeight, margin);
              make.edges.equalTo(view.super).insets(insets);
            },
            views: [
              {
                type: "label",
                props: props.redButton("B", "B"),
                layout: (make, view) => {
                  make.left.bottom.equalTo(0);
                  make.size.equalTo(constants.btnSize.ab.height);
                }
              },
              {
                type: "label",
                props: props.redButton("A", "A"),
                layout: (make, view) => {
                  make.right.bottom.equalTo(0);
                  make.size.equalTo(constants.btnSize.ab.height);
                }
              },
              {
                type: "label",
                props: props.redButton("BA", "B + A"),
                layout: (make, view) => {
                  make.left.top.right.equalTo(0);
                  make.height.equalTo(constants.btnSize.ab.height);
                }
              }
            ]
          }
        ]
      },
      {
        type: "view",
        props: {
          id: "select-start",
          hidden: hideKeypad,
        },
        views: [
          {
            type: "button",
            props: props.functionBtn("SELECT", "SELECT"),
            layout: (make, view) => {
              make.left.top.bottom.equalTo(0);
              make.width.equalTo(constants.btnSize.startSelect.width);
            }
          },
          {
            type: "button",
            props: props.functionBtn("START", "START"),
            layout: (make, view) => {
              make.right.top.bottom.equalTo(0);
              make.width.equalTo(constants.btnSize.startSelect.width);
            }
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
      }
    }
  });
  
  ["SELECT", "START"].forEach(id => {
    let btn = $(id).runtimeValue();
    btn.$addTarget_action_forControlEvents(dispatcher, "touchDown:", (1 << 0));
    btn.$addTarget_action_forControlEvents(dispatcher, "touchUp:", (1 << 6) | (1 << 7) | (1 << 3) | (1 << 5) | 1 << 8);
  });
}

function stateBtnTapped(path) {
  const loader = require("./state-loader");
  loader.open({
    path: path,
    dumpHandler: handler => {
      $("canvas").eval({
        "script": "dumpState()",
        "handler": handler
      });
    },
    loadedHandler: path => {
      $ui.pop();
      $("canvas").eval({
        "script": `loadState("${path}")`
      });
    }
  });
}