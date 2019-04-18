const util = require("../common/util");
const path = "assets/style.css";

exports.open = () => {
  const textView = require("../editor/text-view").new("css");
  textView.$setKeyboardType(1);
  textView.$setPlaceholder($l10n("CUSTOM_CSS_HINT"));
  textView.$setText((() => {
    const file = $file.read(path);
    return file ? file.string : "";
  })());
  
  $ui.push({
    props: {
      title: $l10n("CUSTOM_CSS"),
      navButtons: [
        {
          image: util.loadImage("save"),
          handler: save
        }
      ]
    },
    views: [
      {
        type: "runtime",
        props: {
          id: "style-editor",
          view: textView
        },
        layout: (make, view) => {
          make.edges.equalTo(view.super.safeArea);
        }
      }
    ]
  });
}

function save() {
  const editor = $("style-editor");

  if (editor) {
    const string = $objc("NSString").$stringWithString(editor.text);
    const data = util.stringToData(string);

    $file.write({
      data: data,
      path: path
    });

    editor.blur();
  }

  const taptic = require("../common/taptic");
  taptic.success();
}