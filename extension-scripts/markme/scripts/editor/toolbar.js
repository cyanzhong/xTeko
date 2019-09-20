const constants = require("../common/constants");
const util = require("../common/util");
const keys = ["delete", "undo", "redo", "photo", "#", "-", "*", "`", ">", "!", "[", "]", "(", ")", "|", ":", "~", "_", "$"];
const font = $objc("UIFont").$systemFontOfSize_weight(23, 0.1).rawValue();
const ios12 = parseInt($device.info.version.split(".")[0]) >= 12;

exports.new = textView => {
  const btnInset = 5;
  const btnWidth = 40;
  const btnHeight = 40;

  const toolbar = $objc("UIInputView").$alloc().$initWithFrame_inputViewStyle({
    "x": 0,
    "y": 0,
    "width": 0,
    "height": btnHeight + btnInset * (ios12 ? 1 : 2)
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
          if (key.length > 1) {
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
                font: font
              },
              layout: (make, view) => {
                make.centerX.equalTo(view.super);
                make.centerY.equalTo(view.super).offset(-1);
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
  
  if (title === "delete") {
    textView.$__deleteToFront();
  } else if (title === "undo") {
    undoManager.$undo();
  } else if (title === "redo") {
    undoManager.$redo();
  } else if (title === "photo") {
    insertImage(textView);
  } else {
    textView.$insertTextBlock(title);
  }
}

function insertImage(textView) {

  function insertLink(path) {
    textView.$becomeFirstResponder();
    textView.$insertTextBlock(`![image](${path})`);
  }

  const _util = require("../images/util");
  _util.openImagePicker({
    localEnabled: true,
    selectedPath: path => {
      insertLink(path);
    },
    selectLocalImage: () => {
      const _manager = require("../images/manager");
      _manager.open(insertLink);
    }
  });
}