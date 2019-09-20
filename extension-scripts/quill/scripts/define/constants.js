const appName = "Quill";

exports.appName = appName;

exports.localFolder = "files";

exports.cloudFolder = `drive://${appName}`;

exports.themePath = "assets/editor/theme.css";

exports.notchInset = $device.isIphoneX ? 32 : 0;

exports.onePixel = 1.0 / $device.info.screen.scale;

exports.BTNS = {
  CLEAN: {
    code: "clean"
  },
  BOLD: {
    code: "bold"
  },
  ITALIC: {
    code: "italic"
  },
  UNDERLINE: {
    code: "underline"
  },
  STRIKE: {
    code: "strike"
  },
  FONT: {
    code: "font"
  },
  IMAGE: {
    code: "image"
  },
  LINK: {
    code: "link"
  },
  COLOR: {
    code: "color"
  },
  BACKGROUND: {
    code: "background"
  },
  BLOCKQUOTE: {
    code: "blockquote"
  },
  HEADER: {
    code: "header",
    icons: ["header-1", "header-2", "header-3", "header-4", "header-5", "header-6"]
  },
  ALIGN: {
    code: "align",
    icons: ["align-left", "align-center", "align-right", "align-justify"]
  },
  INDENT_DEC: {
    code: "indent-"
  },
  INDENT_INC: {
    code: "indent+"
  },
  LIST: {
    code: "list",
    icons: ["list-ordered", "list-bullet", "list-checked"]
  },
  SCRIPT: {
    code: "script",
    icons: ["superscript", "subscript"]
  },
  CODE: {
    code: "code-block"
  },
  FORMULA: {
    code: "formula"
  },
  UNDO: {
    code: "undo"
  },
  REDO: {
    code: "redo"
  }
};

exports.fontNames = (() => {
  const names = [];
  const familyNames = $objc("UIFont").$familyNames();

  for (let idx=0; idx<familyNames.$count(); ++idx) {
    const family = familyNames.$objectAtIndex(idx);
    names.push(family.jsValue());
  }

  return names.sort();
})();

exports.fontSizes = [
  "small",
  "normal",
  "large",
  "huge",
];