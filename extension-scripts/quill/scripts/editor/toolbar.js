const BTNS = require("../define/constants").BTNS;
const eventCenter = require("./event").new();
const ios12 = parseInt($device.info.version.split(".")[0]) >= 12;
let btnRefs = {};

exports.new = () => {
  const builder = require("./builder");
  const btnInset = 5;
  const btnWidth = 40;
  const btnHeight = 40;
  const frame = {
    "x": 0,
    "y": 0,
    "width": 0,
    "height": btnHeight + btnInset * (ios12 ? 1 : 2)
  };
  
  const style = 1;
  const toolbar = $objc("UIInputView").$alloc().$initWithFrame_inputViewStyle(frame, style);

  toolbar.jsValue().add({
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
  const keys = Object.keys(BTNS);
  const length = keys.length;
  scroller.contentSize = $size(btnWidth * length + btnInset * (length + 1), btnHeight);

  btnRefs = {};
  for (let idx=0; idx<length; ++idx) {
    const key = keys[idx];
    const props = BTNS[key];
    const btn = builder.button(props);

    btn.$setFrame({
      "x": btnInset + idx * (btnWidth + btnInset),
      "y": 0,
      "width": btnWidth,
      "height": btnHeight
    });

    btn.$addTarget_action_forControlEvents(eventCenter, "btnTapped:", 1 << 6);
    scroller.ocValue().$addSubview(btn);
    btnRefs[props.code] = btn;
  }

  return toolbar;
}

exports.update = format => {
  const setSelected = (code, selected) => {
    btnRefs[code].$setSelected(selected);
  }

  setSelected(BTNS.BOLD.code, format.bold || false);
  setSelected(BTNS.ITALIC.code, format.italic || false);
  setSelected(BTNS.UNDERLINE.code, format.underline || false);
  setSelected(BTNS.STRIKE.code, format.strike || false);
  setSelected(BTNS.LINK.code, format.link !== undefined);
  setSelected(BTNS.BLOCKQUOTE.code, format.blockquote !== undefined);
  setSelected(BTNS.HEADER.code, format.header !== undefined);
  setSelected(BTNS.ALIGN.code, format.align !== undefined);
  setSelected(BTNS.LIST.code, format.list !== undefined);
  setSelected(BTNS.SCRIPT.code, format.script !== undefined);
  setSelected(BTNS.CODE.code, format["code-block"] || false);

  (() => {
    const sender = btnRefs[BTNS.SCRIPT.code];
    if (format.script === "sub") {
      sender.$setGlyph("subscript");
    } else {
      sender.$setGlyph("superscript");
    }
  })();

  (() => {
    const sender = btnRefs[BTNS.LIST.code];
    const glyph = `list-${format.list || "ordered"}`;
    sender.$setGlyph(glyph);
  })();

  (() => {
    const sender = btnRefs[BTNS.HEADER.code];
    const glyph = `header-${format.header || 1}`;
    sender.$setGlyph(glyph);
  })();
}