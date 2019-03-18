const constants = require("./constants");
const dispatcher = require("./dispatcher");
const builder = require("./builder");
const props = builder.props;

const KEY_MAP = {
  "`": {"code": 192},
  "~": {"code": 192, "shift": true},
  "!": {"code": 49, "shift": true},
  "@": {"code": 50, "shift": true},
  "#": {"code": 51, "shift": true},
  "$": {"code": 52, "shift": true},
  "%": {"code": 53, "shift": true},
  "^": {"code": 54, "shift": true},
  "&": {"code": 55, "shift": true},
  "*": {"code": 56, "shift": true},
  "(": {"code": 57, "shift": true},
  ")": {"code": 48, "shift": true},
  "-": {"code": 189},
  "_": {"code": 189, "shift": true},
  "=": {"code": 187},
  "+": {"code": 187, "shift": true},
  "[": {"code": 219},
  "{": {"code": 219, "shift": true},
  "]": {"code": 221},
  "}": {"code": 221, "shift": true},
  "\\": {"code": 220},
  "|": {"code": 220, "shift": true},
  ";": {"code": 186},
  ":": {"code": 186, "shift": true},
  "'": {"code": 222},
  "\"": {"code": 222, "shift": true},
  ",": {"code": 188},
  "<": {"code": 188, "shift": true},
  ".": {"code": 190},
  ">": {"code": 190, "shift": true},
  "/": {"code": 191},
  "?": {"code": 191, "shift": true},
};

$define({
  type: "KeyEventHandler: UITextView",
  events: {
    btnDown: sender => {
      let key = getBtnKey(sender);
      dispatcher.$keyDown(key);
    },
    btnUp: sender => {
      let key = getBtnKey(sender);
      dispatcher.$keyUp(key);
    },
    insertText: text => {
      self.$keyPress(text);
    },
    deleteBackward: () => {
      self.$keyPress("{bksp}");
    },
    keyPress: key => {
      let charCode = key.$characterAtIndex(0);
      if (key == "{bksp}") {
        // delete
        self.$keyEvent(8);
      } else if (charCode == 32) {
        // space
        self.$keyEvent(32);
      } else if (charCode == 10) {
        // enter
        self.$keyEvent(13);
      } else if (charCode >= 48 && charCode <= 57) {
        // 0 ~ 9
        self.$keyEvent(charCode);
      } else if (charCode >= 97 && charCode <= 122) {
        // a ~ z
        self.$keyEvent(charCode - 32);
      } else if (charCode >= 65 && charCode <= 90) {
        // A ~ Z
        self.$keyEvent(charCode, true);
      } else {
        let value = KEY_MAP[key.rawValue()];
        if (value) {
          self.$keyEvent(value.code, value.shift);
        } else {
          console.warn(`Unhandled key: ${key.rawValue()}`);
        }
      }
    },
    keyEvent: (code, shift) => {
      dispatcher.$keyPress_shift_ctrl_alt_meta(code, shift);
    }
  }
});

exports.new = () => {
  let keyboard = $objc("KeyEventHandler").$new();
  keyboard.$setKeyboardType(1);
  keyboard.$setAutocapitalizationType(0);
  keyboard.$setAutocorrectionType(1);
  keyboard.$setSpellCheckingType(1);
  keyboard.$setSmartQuotesType(1);
  keyboard.$setSmartDashesType(1);
  keyboard.$setSmartInsertDeleteType(1);

  keyboard.$setInputAccessoryView((() => {

    let effect = $objc("UIBlurEffect").$effectWithStyle(0);
    let toolbar = $objc("UIVisualEffectView").$alloc().$initWithEffect(effect);
    let view = toolbar.$contentView().rawValue();

    view.add({
      type: "view",
      props: {
        bgcolor: $color("#E0E0E0")
      },
      layout: (make, view) => {
        make.left.top.right.equalTo(0);
        make.height.equalTo(1.0 / $device.info.screen.scale);
      }
    });

    const btnInset = 4;
    const btnWidth = (Math.min($device.info.screen.width, $device.info.screen.height) - btnInset * 8) / 7;
    const btnHeight = 28;
    const btnSize = $size(btnWidth, btnHeight);

    toolbar.$setFrame({
      "x": 0,
      "y": 0,
      "width": 0,
      "height": btnInset * 3 + btnHeight * 2
    });

    view.add({
      type: "button",
      props: props.toolbarButton("#ESC", "ESC", "ESC"),
      layout: (make, view) => {
        make.left.bottom.inset(btnInset);
        make.size.equalTo(btnSize);
      }
    });

    view.add({
      type: "button",
      props: props.toolbarButton("#TAB", "TAB", "TAB"),
      layout: (make, view) => {
        make.bottom.inset(btnInset);
        make.left.equalTo(btnInset * 2 + btnWidth);
        make.size.equalTo(btnSize);
      }
    });

    view.add({
      type: "button",
      props: props.toolbarButton("#LEFT", "LEFT", "←"),
      layout: (make, view) => {
        make.bottom.inset(btnInset);
        make.left.equalTo(btnInset * 3 + btnWidth * 2);
        make.size.equalTo(btnSize);
      }
    });

    view.add({
      type: "button",
      props: props.toolbarButton("#RIGHT", "RIGHT", "→"),
      layout: (make, view) => {
        make.bottom.inset(btnInset);
        make.left.equalTo(btnInset * 4 + btnWidth * 3);
        make.size.equalTo(btnSize);
      }
    });

    view.add({
      type: "button",
      props: props.toolbarButton("#UP", "UP", "↑"),
      layout: (make, view) => {
        make.bottom.inset(btnInset);
        make.left.equalTo(btnInset * 5 + btnWidth * 4);
        make.size.equalTo(btnSize);
      }
    });

    view.add({
      type: "button",
      props: props.toolbarButton("#DOWN", "DOWN", "↓"),
      layout: (make, view) => {
        make.bottom.inset(btnInset);
        make.left.equalTo(btnInset * 6 + btnWidth * 5);
        make.size.equalTo(btnSize);
      }
    });

    view.add({
      type: "button",
      props: {
        bgcolor: constants.color.keyGray,
        smoothRadius: 6
      },
      layout: (make, view) => {
        make.right.bottom.inset(btnInset);
        make.size.equalTo(btnSize);
      },
      events: {
        tapped: () => {
          keyboard.$resignFirstResponder();
        }
      },
      views: [
        {
          type: "image",
          props: {
            src: "assets/dismiss.png"
          },
          layout: (make, view) => {
            make.center.equalTo(view.super);
            make.size.equalTo($size(24, 24));
          }
        }
      ]
    });

    view.add({
      type: "scroll",
      props: {
        id: "fn-scroller",
        showsHorizontalIndicator: false,
        alwaysBounceVertical: false
      },
      layout: (make, view) => {
        make.left.right.equalTo(0);
        make.top.equalTo(btnInset);
        make.height.equalTo(btnHeight);
      }
    });

    let scroller = $("fn-scroller");
    let fns = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];
    scroller.contentSize = $size(btnWidth * fns.length + btnInset * (fns.length + 1), btnHeight);

    for (var idx=0; idx<fns.length; ++idx) {
      let fn = fns[idx];
      scroller.add({
        type: "button",
        props: (() => {
          let dict = props.toolbarButton(fn, fn, fn);
          dict.frame = $rect(btnInset + idx * (btnWidth + btnInset), 0, btnWidth, btnHeight);
          return dict;
        })(),
      });
    }
    
    bindButtons(keyboard, [
      "#ESC",
      "#TAB",
      "#LEFT",
      "#RIGHT",
      "#UP",
      "#DOWN",
    ].concat(fns));

    return toolbar;
  })());

  return keyboard;
};

function bindButtons(target, ids) {
  ids.forEach(id => {
    let btn = $(id).runtimeValue();
    btn.$addTarget_action_forControlEvents(target, "btnDown:", (1 << 0));
    btn.$addTarget_action_forControlEvents(target, "btnUp:", (1 << 6) | (1 << 7) | (1 << 3) | (1 << 5) | 1 << 8);
  });
}

function getBtnKey(button) {
  return button.rawValue().info.key;
}