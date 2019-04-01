const util = require("../common/util");
const keys = ["undo", "redo", "#", "-", "*", "`", ">", "!", "[", "]", "(", ")", "|", ":", "~", "_", "$"];

exports.new = textView => {
  const btnInset = 5;
  const btnWidth = 40;
  const btnHeight = 40;

  const toolbar = $objc("UIInputView").$alloc().$initWithFrame_inputViewStyle({
    "x": 0,
    "y": 0,
    "width": 0,
    "height": btnHeight + btnInset
  }, 1);

  const view = toolbar.rawValue();

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
      make.top.equalTo(btnInset);
      make.height.equalTo(btnHeight);
    }
  });

  const scroller = $("scroller");
  scroller.contentSize = $size(btnWidth * keys.length + btnInset * (keys.length + 1), btnHeight);

  const insets = {"top": 6, "left": 6, "bottom": 6, "right": 6};
  const image = util.loadImage("btn");
  const btnImage = util.imageWithInsets(image, insets);
  for (let idx=0; idx<keys.length; ++idx) {
    const key = keys[idx];

    scroller.add({
      type: "button",
      props: (() => {
        const values = {
          id: key,
          info: {key: key},
          bgcolor: $color("clear"),
          image: btnImage,
          smoothRadius: 5
        };
        values.frame = $rect(btnInset + idx * (btnWidth + btnInset), 0, btnWidth, btnHeight);
        return values;
      })(),
      events: {
        tapped: sender => {
          btnTapped(sender, textView)
        }
      },
      views: [
        (() => {
          if (key === "undo" || key === "redo") {
            return {
              type: "image",
              props: {
                src: `assets/${key}.png`,
              },
              layout: (make, view) => {
                make.center.equalTo(view.super);
                make.size.equalTo($size(18, 16));
              }
            }
          } else {
            return {
              type: "label",
              props: {
                text: key,
                textColor: $color("black"),
                font: $font(".SF UI Text", 24)
              },
              layout: (make, view) => {
                make.centerX.equalTo(view.super);
                make.centerY.equalTo(view.super).offset(-1.5);
              }
            }
          }
        })()
      ]
    });
  }

  return toolbar;
}

function btnTapped(sender, textView) {
  $keyboard.playInputClick();

  const title = sender.info.key;
  const undoManager = textView.$undoManager();
  
  if (title === "undo") {
    undoManager.$undo();
  } else if (title === "redo") {
    undoManager.$redo();
  } else {
    textView.$insertTextBlock(title);
  }
}