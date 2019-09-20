const util = require("../common/util");
const colors = require("../define/colors");

$define({
  type: "QuillButton: BaseButton",
  props: ["code", "iconValue", "selectedValue"],
  events: {
    "initWithCode:icon:": (code, icon) => {
      self = self.$super().$init();
      self.$setCode(code);
      self.$setIconValue(icon);
      self.$setSelectedValue(false);
      self.$setStyle();
      const image = util.loadImage("toolbar/btn");
      const insets = {"top": 6, "left": 6, "bottom": 6, "right": 6};
      const resizable = util.imageWithInsets(image, insets);
      self.$setBackgroundImage_forState(resizable.ocValue(), 0);
      return self;
    },
    "glyph": () => {
      return self.$iconValue().jsValue();
    },
    "setGlyph:": glyph => {
      self.$setIconValue(glyph);
      self.$setStyle();
    },
    "selected": () => {
      return self.$selectedValue();
    },
    "setSelected:": selected => {
      self.$setSelectedValue(selected);
      self.$setStyle();
    },
    "setStyle": () => {
      const color = self.$selectedValue() ? colors.blue : colors.black;
      const image = util.loadImage(`toolbar/${self.$iconValue().jsValue()}`);
      const tintImage = image.ocValue().$imageWithRenderingMode(2);
      self.$setImage_forState(tintImage, 0);
      self.$setTintColor(color);
    }
  }
});

exports.button = props => {
  const icon = props.icons ? props.icons[0] : props.code;
  const button = $objc("QuillButton").$alloc().$initWithCode_icon(props.code, icon);
  return button;
}