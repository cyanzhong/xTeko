const constants = require("./constants");
const colors = require("./colors");
const fonts = require("./fonts");

exports.inject = () => {
  exports.cancel();
  
  $define({
    type: "WKContentView",
    props: ["inputView"],
    events: {
      "didMoveToWindow": () => {
        self.$ORIGdidMoveToWindow();

        const inputView = $objc("UIScrollView").$new();
        const btns = constants.btns;
        const btnInset = 4;
        const btnWidth = (Math.min($device.info.screen.width, $device.info.screen.height) - btnInset * (btns.length + 1)) / btns.length;
        const btnHeight = 32;
        
        const scroller = inputView.rawValue();
        scroller.bgcolor = colors.lightGray;
        scroller.showsHorizontalIndicator = false;
        scroller.alwaysBounceVertical = false;
        scroller.alwaysBounceHorizontal = true;
        scroller.frame = $rect(0, 0, 0, btnHeight + btnInset * 2);
        scroller.contentSize = $size(btnWidth * btns.length + btnInset * (btns.length + 1), btnHeight + btnInset * 2);
        
        for (let idx=0; idx<btns.length; ++idx) {
          const title = btns[idx];
          scroller.add({
            type: "button",
            props: {
              title: title,
              font: fonts.system(18),
              bgcolor: colors.darkGray,
              titleColor: colors.textColor,
              frame: $rect(btnInset + idx * (btnWidth + btnInset), btnInset, btnWidth, btnHeight)
            },
            events: {
              tapped: sender => {
                buttonTapped(sender.title);
              }
            }
          });
        }

        self.$setInputView(inputView);
      },
      "inputAccessoryView": () => {
        return self.$inputView();
      }
    }
  });

  function buttonTapped(title) {
    $keyboard.playInputClick();

    const editor = $("editor");
    const text = title === "→" ? "  " : title;
    if (editor) {
      editor.eval({
        "script": `insertText("${text}")`
      });
    }
  }
}

exports.cancel = () => {
  $objc("RedBoxCore").$cleanClass("WKContentView");
}