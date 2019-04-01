const util = require("../common/util");
const path = "assets/style.css";

exports.open = () => {
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
        type: "text",
        props: {
          id: "style-editor",
          placeholder: $l10n("CUSTOM_CSS_HINT"),
          text: (() => {
            const file = $file.read(path);
            return file ? file.string : "";
          })()
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