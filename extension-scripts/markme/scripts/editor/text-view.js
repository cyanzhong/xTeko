const layout = require("./layout");
const keyman = require("./keyman");
const observer = require("./observer");
const toolbar = require("./toolbar");
const constants = require("../common/constants");
const storage = require("../settings/storage");

$define({
  type: "MMTextView: HOCodeView",
  props: ["fontName", "edited"],
  events: {
    "setFontSize": size => {
      self.$super().$setFontSize(size);

      const font = (() => {
        const name = self.$fontName();
        if (name === ".SF UI Text") {
          return $objc("UIFont").$systemFontOfSize(size);
        } else {
          return $objc("UIFont").$fontWithName_size(name, size);
        }
      })();
      self.$setFont(font);

      const highlighter = self.$storage().$highlighter();
      if (highlighter) {
        highlighter.$setLineWrapMode(0);
        highlighter.$theme().$setFont(font);
      }

      const layoutManager = self.$layoutManager();
      if (layoutManager) {
        layoutManager.$setupFont(font);
      }
    },
    "setLinePadding": padding => {
      const layout = self.$layoutManager().$delegate();
      layout.$setLinePadding(padding);
    },
    "shouldHighlight": range => {
      return true;
    },
    "canPerformAction:withSender:": (action, sender) => {
      const selectedText = self.$selectedText().rawValue();
      const clipboardText = $clipboard.text;
      const selector = action.rawValue();
      if (selector === "cut:" || selector === "copy:" || selector === "_transliterateChinese:" || selector === "_lookup:") {
        return selectedText.length > 0;
      } else if (selector === "select:" || selector === "selectAll:") {
        return selectedText.length == 0;
      } else if (selector === "paste:") {
        return clipboardText && clipboardText.length > 0;
      } else {
        return false;
      }
    },
    "textInputMode": () => {
      return $objc("UITextInputMode").$currentInputMode();
    }
  }
});

exports.new = (language="markdown") => {
  const screen = $device.info.screen;
  const frame = {"x": 0, "y": 0, "width": screen.width, "height": screen.height};

  const textView = $objc("MMTextView").$alloc().$initWithFrame_lang_style_text_showLineNumber(
    frame,
    language,
    storage.theme(),
    "",
    false
  );

  const updateInset = bottomInset => {
    const padding = 10;
    const insets = {
      "top": padding,
      "left": padding,
      "bottom": padding + bottomInset - (bottomInset > 0 ? constants.notchInset : 0),
      "right": padding
    };

    textView.$setTextContainerInset(insets);
    
    textView.$setContentInset({
      "top": 0,
      "left": 0,
      "bottom": 0,
      "right": padding
    });

    textView.$setScrollIndicatorInsets({
      "top": 0,
      "left": 0,
      "bottom": insets.bottom,
      "right": 0
    });
  }

  textView.$setEdited(false);
  textView.$setAutocorrectionType(0);
  textView.$setFontName(storage.font());
  textView.$setFontSize(storage.fontSize());
  textView.$setKeyboardAppearance(0);
  textView.$layoutManager().$setDelegate(layout.new());
  textView.$setLinePadding(storage.linePadding());
  textView.$setInputAccessoryView(toolbar.new(textView));

  updateInset(0);
  keyman.observe(height => {
    updateInset(height);
    textView.$scrollToCaretRectVisible();
  });

  observer.observe(textView);
  return textView;
}