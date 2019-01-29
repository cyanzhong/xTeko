$define({
  type: "PMEmojiButton: BaseButton",
  props: ["border"],
  events: {
    "initWithEmoji": emoji => {
      self = self.$super().$init();
      self.$setTitle(emoji);
      self.$setTitleColor($color("black").runtimeValue());
      self.$setBackgroundColor($color("clear").runtimeValue());

      let border = $objc("UIView").$new();
      border.$layer().$setBorderWidth(2);
      border.$layer().$setCornerRadius(4);
      border.$setUserInteractionEnabled(false);
      self.$setBorder(border);
      self.$addSubview(border);
      self.$setSelected(false);
      return self;
    },
    "setSelected": selected => {
      let hex = selected ? "#157efb" : "#b7bec6";
      let color = $color(hex).runtimeValue();
      let cgColor = color.$CGColor();
      let border = self.$border();
      border.$layer().$setBorderColor(cgColor);
    },
    "layoutSubviews": () => {
      self.$super().$layoutSubviews();
      let border = self.$border();
      border.$setFrame(self.$bounds());
    }
  }
});

$define({
  type: "PMCanvas: UIView",
  events: {
    "init": () => {
      self = self.$super().$init();

      let font = $font(15).runtimeValue();
      let text = "◻️";
      for (var row=0; row<ROWS; ++row) {
        for (var col=0; col<COLUMNS; ++col) {
          let label = $objc("UILabel").$new();
          label.$setFont(font);
          label.$setText(text);
          label.$setTextAlignment(1);
          label.$setTag(10000 + row << 2 + col << 1);
          self.$addSubview(label);
        }
      }

      return self;
    },
    "layoutSubviews": () => {
      self.$super().$layoutSubviews();
      let size = self.$tileSize();
      self.$forEachItem((label, row, col) => {
        label.$setFrame({
          "x": size * col,
          "y": size * row,
          "width": size,
          "height": size
        });
      });
    },
    "touchesBegan:withEvent:": (touches, event) => {
      let state = self.$getState();
      undoStack.push(state);
      updateUndoRedoButtons();

      self.$touchesMoved_withEvent(touches, event);
      $device.taptic(0);
    },
    "touchesMoved:withEvent:": (touches, event) => {
      let label = self.$tileForTouches(touches);
      label.$setText(emoji);
    },
    "tileForTouches": touches => {
      let touch = touches.$anyObject();
      let point = touch.$locationInView(self);
      let tileSize = self.$tileSize();
      let x = parseInt(point.x / tileSize);
      let y = parseInt(point.y / tileSize);
      let tag = 10000 + y << 2 + x << 1;
      let tile = self.$viewWithTag(tag);
      return tile;
    },
    "exportText": () => {
      var text = "";
      for (var row=0; row<ROWS; ++row) {
        for (var col=0; col<COLUMNS; ++col) {
          let tag = 10000 + row << 2 + col << 1;
          let label = self.$viewWithTag(tag);
          text += label.$text().rawValue();
        }
        if (row < ROWS - 1) {
          text += "\n";
        }
      }
      return text;
    },
    "tileSize": () => {
      let frame = self.$frame();
      let width = frame.width;
      return width / COLUMNS;
    },
    "forEachItem": handler => {
      for (var row=0; row<ROWS; ++row) {
        for (var col=0; col<COLUMNS; ++col) {
          let tag = 10000 + row << 2 + col << 1;
          let label = self.$viewWithTag(tag);
          handler(label, row, col);
        }
      }
    },
    "getState": () => {
      let state = [];
      self.$forEachItem((label, row, col) => {
        state.push({
          "row": row,
          "col": col,
          "text": label.$text().rawValue()
        });
      });
      return state;
    },
    "setState": state => {
      for (const item of state) {
        let row = item.row;
        let col = item.col;
        let tag = 10000 + row << 2 + col << 1;
        let label = self.$viewWithTag(tag);
        label.$setText(item.text);
      }
    }
  }
});

const COLUMNS = 10;
const ROWS = 10;

var emoji = null;
var undoStack = [];
var redoStack = [];

exports.init = () => {
  $ui.render({
    props: {
      title: $l10n("MAIN_TITLE")
    },
    views: [
      {
        type: "view",
        layout: (make, view) => {
          if ($app.env == $env.app) {
            make.centerY.equalTo(view.super);
            make.left.right.equalTo(0);
            make.height.equalTo(267);
          } else {
            make.edges.equalTo(view.super);
          }
        },
        views: [
          {
            type: "runtime",
            props: {
              id: "canvas",
              view: $objc("PMCanvas").$new()
            },
            layout: (make, view) => {
              make.top.bottom.equalTo(0);
              make.centerX.equalTo(view.super);
              make.width.equalTo(view.height);
            }
          },
          {
            type: "view",
            layout: (make, view) => {
              make.top.bottom.right.equalTo(0);
              make.left.equalTo($("canvas").right);
            },
            views: [
              {
                type: "button",
                props: {
                  id: "undo-button",
                  src: "assets/undo.png",
                  enabled: false
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.centerY.equalTo(view.super).multipliedBy(0.2);
                  make.size.equalTo($size(25, 25));
                },
                events: {
                  tapped: undo
                }
              },
              {
                type: "button",
                props: {
                  id: "redo-button",
                  src: "assets/redo.png",
                  enabled: false
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.centerY.equalTo(view.super).multipliedBy(0.6);
                  make.size.equalTo($size(25, 25));
                },
                events: {
                  tapped: redo
                }
              },
              {
                type: "button",
                props: {
                  src: "assets/copy.png"
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.centerY.equalTo(view.super).multipliedBy(1.0);
                  make.size.equalTo($size(25, 25));
                },
                events: {
                  tapped: copy
                }
              },
              {
                type: "button",
                props: {
                  src: "assets/enter.png"
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.centerY.equalTo(view.super).multipliedBy(1.4);
                  make.size.equalTo($size(25, 25));
                },
                events: {
                  tapped: enter
                }
              },
              {
                type: "button",
                props: {
                  src: "assets/send.png"
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.centerY.equalTo(view.super).multipliedBy(1.8);
                  make.size.equalTo($size(25, 25));
                },
                events: {
                  tapped: send
                }
              }
            ]
          },
          {
            type: "view",
            props: {
              id: "buttons"
            },
            layout: (make, view) => {
              make.top.bottom.left.equalTo(0);
              make.right.equalTo($("canvas").left);
            },
            views: [
              {
                type: "runtime",
                props: {
                  id: "current-emoji",
                  view: $objc("PMEmojiButton").$alloc().$initWithEmoji("◼️"),
                  userInteractionEnabled: false
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.centerY.equalTo(view.super).multipliedBy(0.2);
                  make.size.equalTo($size(32, 32));
                },
                events: {
                  ready: sender => {
                    sender.runtimeValue().$setSelected(true);
                    updateEmoji($cache.get("selected-emoji") || "◼️");
                  }
                }
              },
              {
                type: "runtime",
                props: {
                  view: $objc("PMEmojiButton").$alloc().$initWithEmoji("◻️")
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.centerY.equalTo(view.super).multipliedBy(0.6);
                  make.size.equalTo($size(32, 32));
                },
                events: {
                  tapped: sender => setEmoji(sender)
                }
              },
              {
                type: "runtime",
                props: {
                  view: $objc("PMEmojiButton").$alloc().$initWithEmoji("◼️")
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.centerY.equalTo(view.super).multipliedBy(1.0);
                  make.size.equalTo($size(32, 32));
                },
                events: {
                  tapped: sender => setEmoji(sender)
                }
              },
              {
                type: "runtime",
                props: {
                  view: $objc("PMEmojiButton").$alloc().$initWithEmoji("😂")
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.centerY.equalTo(view.super).multipliedBy(1.4);
                  make.size.equalTo($size(32, 32));
                },
                events: {
                  tapped: sender => setEmoji(sender)
                }
              },
              {
                type: "runtime",
                props: {
                  view: $objc("PMEmojiButton").$alloc().$initWithEmoji("...")
                },
                layout: (make, view) => {
                  make.centerX.equalTo(view.super);
                  make.centerY.equalTo(view.super).multipliedBy(1.8);
                  make.size.equalTo($size(32, 32));
                },
                events: {
                  tapped: sender => selectEmoji(sender)
                }
              }
            ]
          }
        ]
      }
    ]
  });
}

function undo() {
  $device.taptic(0);

  let canvas = $("canvas").runtimeValue();
  redoStack.push(canvas.$getState());

  let state = undoStack.pop();
  canvas.$setState(state);

  updateUndoRedoButtons();
}

function redo() {
  $device.taptic(0);

  let canvas = $("canvas").runtimeValue();
  undoStack.push(canvas.$getState());

  let state = redoStack.pop();
  canvas.$setState(state);

  updateUndoRedoButtons();
}

function copy() {
  $device.taptic(0);
  $clipboard.text = exportText()
}

function enter() {
  $device.taptic(0);
  $keyboard.insert(exportText())
}

function send() {
  $device.taptic(0);
  $keyboard.send();
}

function setEmoji(sender) {
  $device.taptic(0);
  updateEmoji(sender.title);
}

function selectEmoji(sender) {
  $device.taptic(0);
  let picker = require("./emoji-picker");
  picker.select(emoji => updateEmoji(emoji));
}

function updateEmoji(newValue) {
  if (emoji != newValue) {
    $cache.set("selected-emoji", newValue);
    emoji = newValue;
    $("current-emoji").title = newValue;
  }
}

function exportText() {
  return $("canvas").runtimeValue().$exportText();
}

function updateUndoRedoButtons() {
  $("undo-button").enabled = undoStack.length > 0;
  $("redo-button").enabled = redoStack.length > 0;
}