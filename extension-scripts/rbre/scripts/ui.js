const constants = require("./constants");
const colors = require("./colors");
const fonts = require("./fonts");
const cache = require("./cache");

let history = cache.getHistory();
let cursor = 0;

exports.init = () => {
  $ui.render({
    props: {
      title: "RbRe",
      navButtons: [
        {
          icon: "028",
          handler: showModules
        }
      ]
    },
    views: [
      {
        type: "web",
        props: {
          id: "core",
          url: `http://localhost:${constants.port}/index.html`,
          showsProgress: false,
          hidden: true
        },
        layout: $layout.fill,
        events: {
          onload: result => {
            const code = $("code");
            code.text = result;
            
            $ui.animate({
              duration: 0.2,
              animation: () => {
                code.alpha = 1;
              }
            });

            $("input").focus();
            $ui.loading(false);
          }
        }
      },
      {
        type: "view",
        props: {
          id: "container",
          bgcolor: colors.darkGray
        },
        layout: $layout.fill,
        views: [
          {
            type: "view",
            props: {
              id: "toolbar",
              bgcolor: colors.lightGray
            },
            views: [
              {
                type: "button",
                props: {
                  id: "prev-btn",
                  src: "assets/prev.png"
                },
                layout: (make, view) => {
                  make.centerY.equalTo(view.super);
                  make.left.equalTo(view.super.safeAreaLeft).offset(8);
                  make.size.equalTo($size(28, 28));
                },
                events: {
                  tapped: moveToPrev
                }
              },
              {
                type: "button",
                props: {
                  id: "next-btn",
                  src: "assets/next.png"
                },
                layout: (make, view) => {
                  make.centerY.equalTo(view.super);
                  make.left.equalTo($("prev-btn").right).offset(8);
                  make.size.equalTo($size(28, 28));
                },
                events: {
                  tapped: moveToNext
                }
              },
              {
                type: "input",
                props: {
                  id: "input",
                  type: $kbType.ascii,
                  darkKeyboard: true,
                  bgcolor: colors.darkGray,
                  textColor: colors.textColor,
                  tintColor: colors.lightGray,
                  font: fonts.regular(17),
                  smoothRadius: 6
                },
                layout: (make, view) => {
                  make.top.bottom.inset(5);
                  make.right.equalTo(view.super.safeAreaRight).inset(4);
                  make.left.equalTo($("next-btn").right).offset(8);
                },
                events: {
                  ready: sender => {
                    const inputView = sender.runtimeValue();
                    inputView.$setInputAccessoryView((() => {
                      const btns = constants.btns;
                      const btnInset = 4;
                      const btnWidth = (Math.min($device.info.screen.width, $device.info.screen.height) - btnInset * (btns.length + 1)) / btns.length;
                      const btnHeight = 32;
                      const toolbar = $objc("UIView").$new();
                      const view = toolbar.rawValue();

                      view.bgcolor = colors.lightGray;
                      view.add({
                        type: "scroll",
                        props: {
                          id: "scroller",
                          showsHorizontalIndicator: false,
                          alwaysBounceVertical: false,
                          alwaysBounceHorizontal: true
                        },
                        layout: (make, view) => {
                          make.left.right.equalTo(0);
                          make.top.equalTo(0);
                          make.bottom.inset(0);
                        }
                      });
                  
                      toolbar.$setFrame({
                        "x": 0,
                        "y": 0,
                        "width": 0,
                        "height": btnHeight + btnInset
                      });
                      
                      const scroller = $("scroller");
                      scroller.contentSize = $size(btnWidth * btns.length + btnInset * (btns.length + 1), btnHeight);
                      
                      for (var idx=0; idx<btns.length; ++idx) {
                        const title = btns[idx];
                        scroller.add({
                          type: "button",
                          props: {
                            title: title,
                            font: fonts.system(18),
                            bgcolor: colors.darkGray,
                            titleColor: colors.textColor,
                            frame: $rect(btnInset + idx * (btnWidth + btnInset), 0, btnWidth, btnHeight)
                          },
                          events: {
                            tapped: sender => {
                              buttonTapped(sender.title);
                            }
                          }
                        });
                      }
                  
                      return toolbar;
                    })());
                  },
                  returned: sender => {
                    const text = sender.text;
                    sender.text = "";
                    runCode(text);

                    if (text.length > 0) {
                      history.unshift(text);
                      if (history.length > constants.historySize) {
                        history = history.slice(0, constants.historySize);
                      }
                      cache.setHistory(history);
                    }
                  }
                }
              }
            ]
          },
          {
            type: "view",
            props: {
              id: "wrapper"
            },
            views: [
              {
                type: "text",
                props: {
                  id: "code",
                  bgcolor: colors.darkGray,
                  textColor: colors.textColor,
                  font: fonts.regular(),
                  editable: false,
                  keyboardDismissMode: 0,
                  alpha: 0
                },
                layout: (make, view) => {
                  make.top.bottom.equalTo(0);
                  make.left.equalTo(view.super.safeAreaLeft);
                  make.right.equalTo(view.super.safeAreaRight);
                }
              }
            ]
          }
        ]
      }
    ]
  });

  let rootView = $("container").runtimeValue().$viewController().$view();
  rootView.$layoutIfNeeded();
  resizeViews(0);

  $ui.loading(true);
}

exports.resizeViews = resizeViews;

function resizeViews(offset) {
  offset = Math.max(constants.extendedEdge, offset);

  const frame = $("container").frame;
  const height = constants.toolbarHeight;

  $("toolbar").frame = $rect(0, frame.height - height - offset, frame.width, height);
  $("wrapper").frame = $rect(0, 0, frame.width, frame.height - height - offset - 2);
  scrollToBottom();
}

function scrollToBottom() {
  const code = $("code");
  const range = {"location": code.text.length - 1, "length": 1};
  code.runtimeValue().$scrollRangeToVisible(range);
}

function runCode(text) {
  const flush = result => {
    $("code").text = result;
    scrollToBottom();
  }

  evaluate(`append('${$text.base64Encode(text)}')`, result => {
    flush(result);
    evaluate("evaluate()", result => {
      flush(result);
    });
  });
}

function evaluate(script, handler) {
  const core = $("core");
  if (core) {
    core.eval({
      "script": script,
      "handler": handler
    });
  }
}

function moveToPrev() {
  if (history.length == 0) {
    return;
  }

  const input = $("input");
  if (input.text === history[cursor]) {
    cursor = cursor + 1;
  }

  input.text = history[Math.min(history.length - 1, cursor)];
  cursor = Math.min(history.length - 1, cursor + 1);
  $device.taptic();
}

function moveToNext() {
  if (history.length == 0) {
    return;
  }

  const input = $("input");
  if (input.text === history[cursor]) {
    cursor = cursor - 1;
  }

  input.text = history[Math.max(0, cursor)];
  cursor = Math.max(0, cursor - 1);
  $device.taptic();
}

function buttonTapped(text) {
  $keyboard.playInputClick();
  const input = $("input");
  let value = input.text;

  const replace = replacement => {
    const field = input.runtimeValue();
    const range = field.$selectedTextRange();
    field.$replaceRange_withText(range, replacement);
  }

  if (text === "→") {
    replace("  ");
  } else {
    replace(text);
  }
}

function showModules() {
  const explorer = require("./explorer");
  explorer.open({
    import: name => {
      const file = $file.read(`modules/${name}`);
      runCode(file.string);
    }
  });
}