const constants = require("../define/constants");
const util = require("../common/util");
const BTNS = constants.BTNS;
const TOGGLEABLES = [
  BTNS.BOLD.code,
  BTNS.ITALIC.code,
  BTNS.UNDERLINE.code,
  BTNS.STRIKE.code,
  BTNS.BLOCKQUOTE.code,
  BTNS.CODE.code,
];

$define({
  type: "QuillEventCenter: NSObject",
  events: {
    "btnTapped:": async(sender) => {
      const code = sender.$code().jsValue();
      if (TOGGLEABLES.includes(code)) {
        toggle(sender, code);
      } else if (code === BTNS.CLEAN.code) {
        evaluate("clean");
      } else if (code === BTNS.FONT.code) {
        selectFont();
      } else if (code === BTNS.IMAGE.code) {
        selectImage();
      } else if (code === BTNS.LINK.code) {
        editLink();
      } else if (code === BTNS.COLOR.code || code === BTNS.BACKGROUND.code) {
        selectColor(code);
      } else if (code === BTNS.HEADER.code) {
        headerStyle(sender);
      } else if (code === BTNS.ALIGN.code) {
        alignStyle(sender);
      } else if (code === BTNS.INDENT_DEC.code) {
        evaluate("indent", -1);
      } else if (code === BTNS.INDENT_INC.code) {
        evaluate("indent", +1);
      } else if (code === BTNS.LIST.code) {
        listStyle(sender);
      } else if (code === BTNS.SCRIPT.code) {
        scriptStyle(sender);
      } else if (code === BTNS.FORMULA.code) {
        insertFormula(sender);
      } else if (code === BTNS.UNDO.code) {
        evaluate("undo");
      } else if (code === BTNS.REDO.code) {
        evaluate("redo");
      }

      $keyboard.playInputClick();
    }
  }
});

function toggle(sender, code) {
  const selected = !sender.$selected();
  format(code, selected);
  sender.$setSelected(selected);
}

async function selectFont() {
  const editor = $("editor");
  editor.ocValue().$resignFirstResponder();
  await $wait(0.1);

  editor.eval({
    "script": "getFormat()",
    "handler": style => {
      const name = style.font || ""; 
      const size = style.size || "normal";
      const picker = require("../font/picker");
      picker.selectFont(name, size, (name, size) => {
        evaluate("setFont", name);
        format("size", size);
        $device.taptic();
      });
    }
  });
}

async function selectImage() {
  const OPTIONS = {
    "PHOTO_LIBRARY": $l10n("PHOTO_LIBRARY"),
    "CAMERA": $l10n("CAMERA"),
    "SCAN_DOCUMENTS": $l10n("SCAN_DOCUMENTS"),
    "ADD_SKETCH": $l10n("ADD_SKETCH"),
  };

  const {title} = await $ui.menu(Object.values(OPTIONS));
  const handleImage = image => {
    const info = util.compressImage(image);
    const base64 = $text.base64Encode(info.data);
    const source = `data:image/${info.type};base64,${base64}`;
    evaluate("insertImage", source);
  }

  if (title === OPTIONS.PHOTO_LIBRARY) {
    const result = await $photo.pick();
    handleImage(result.image.orientationFixedImage);
  } else if (title === OPTIONS.CAMERA) {
    const result = await $photo.take();
    handleImage(result.image.orientationFixedImage);
  } else if (title === OPTIONS.SCAN_DOCUMENTS) {
    const scanner = require("../image/scanner");
    scanner.open(images => {
      if (images.length > 0) {
        handleImage(images[0]);
      }
    });
  } else if (title === OPTIONS.ADD_SKETCH) {
    const sketcher = require("../image/sketcher");
    sketcher.open(image => {
      handleImage(image);
    });
  }
}

function editLink() {
  util.showTextField($l10n("ADD_LINK"), $l10n("URL"), textField => {
    textField.$setKeyboardType(3);
    const editor = $("editor");
    if (editor) {
      editor.eval({
        "script": "getFormat()",
        "handler": format => {
          const link = format.link || "";
          textField.$setText(link);
        }
      });
    }
  }, link => {
    format("link", link);
  });
}

async function headerStyle(sender) {
  const options = ["H1", "H2", "H3", "H4", "H5", "H6", $l10n("NONE")];
  const {title} = await $ui.menu(options);

  if (title == undefined) {
    return;
  }

  if (title === $l10n("NONE")) {
    sender.$setGlyph("header-1");
    sender.$setSelected(false);
    format("header", null);
  } else {
    const level = parseInt(title.replace("H", ""));
    sender.$setGlyph(`header-${level}`);
    sender.$setSelected(true);
    format("header", level);
  }
}

function alignStyle(sender) {
  // Order: left, center, right, justify
  const glyph = sender.$glyph();
  const selected = sender.$selected();

  if (glyph === "align-left") {
    // left
    sender.$setGlyph("align-center");
    sender.$setSelected(true);
  } else if (glyph === "align-center") {
    // center
    sender.$setGlyph("align-right");
  } else if (glyph === "align-right") {
    // right
    sender.$setGlyph("align-justify");
  } else if (glyph === "align-justify") {
    // justify
    sender.$setGlyph("align-left");
    sender.$setSelected(false);
  }

  const style = (() => {
    const glyph = sender.$glyph();
    const selected = sender.$selected();
    if (selected) {
      return glyph.split("-").pop();
    } else {
      return null;
    }
  })();

  format("align", style);
}

function listStyle(sender) {
  // Order: none, ordered, bullet, checked
  const glyph = sender.$glyph();
  const selected = sender.$selected();

  if (glyph === "list-ordered") {
    if (selected) { // ordered
      sender.$setGlyph("list-bullet");
    } else { // none
      sender.$setSelected(true);
    }
  } else if (glyph === "list-bullet") {
    // bullet
    sender.$setGlyph("list-checked");
  } else if (glyph === "list-checked") {
    // checked
    sender.$setGlyph("list-ordered");
    sender.$setSelected(false);
  }

  const style = (() => {
    const glyph = sender.$glyph();
    const selected = sender.$selected();
    if (selected) {
      return glyph.split("-").pop();
    } else {
      return null;
    }
  })();

  format("list", style);
}

function scriptStyle(sender) {
  // Order: none, superscript, subscript
  const glyph = sender.$glyph();
  const selected = sender.$selected();

  if (glyph === "superscript") {
    if (selected) { // superscript
      sender.$setGlyph("subscript");
    } else { // none
      sender.$setSelected(true);
    }
  } else if (glyph === "subscript") {
    // subscript
    sender.$setGlyph("superscript");
    sender.$setSelected(false);
  }

  const style = (() => {
    const glyph = sender.$glyph();
    const selected = sender.$selected();
    if (selected) {
      if (glyph === "subscript") {
        return "sub";
      } else {
        return "super";
      }
    } else {
      return null;
    }
  })();

  format("script", style);
}

function insertFormula(sender) {
  util.showTextField($l10n("ADD_FORMULA"), $l10n("FORMULA_EXAMPLE"), textField => {
    textField.$setKeyboardType(1);
  }, formula => {
    format("formula", formula);
  });
}

async function selectColor(code) {
  const color = await $picker.color();
  const alpha = color.components.alpha;
  if (alpha === 0) {
    format(code, null);
  } else {
    format(code, color.hexCode);
  }
  evaluate("focus");
}

function format(name, value) {
  const editor = $("editor");
  if (editor == null) {
    return;
  }

  const args = typeof value === "string" ? `"${value}"` : JSON.stringify(value);
  editor.eval({
    "script": `format("${name}", ${args})`
  });
}

function evaluate(name, value) {
  const editor = $("editor");
  if (editor == null) {
    return;
  }

  const args = (() => {
    if (value) {
      return typeof value === "string" ? `"${value}"` : JSON.stringify(value);
    } else {
      return "";
    }
  })();
  
  editor.eval({
    "script": `${name}(${args})`
  });
}

exports.new = () => {
  const eventCenter = $objc("QuillEventCenter").$new();
  $objc_retain(eventCenter);
  return eventCenter;
}