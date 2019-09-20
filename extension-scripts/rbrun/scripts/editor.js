const util = require("./util");
const colors = require("./colors");
const runner = require("./runner");

exports.open = path => {
  $ui.push({
    props: {
      title: path.split("/").pop(),
      navButtons: [
        {
          image: util.loadImage("nav-run"),
          handler: () => {
            runFile(path);
          }
        },
        {
          image: util.loadImage("nav-save"),
          handler: () => {
            saveFile(path);
          }
        }
      ]
    },
    views: [
      {
        type: "web",
        props: {
          id: "editor",
          showsProgress: false,
          bgcolor: colors.darkGray,
          opaque: false,
          html: $file.read("assets/editor.html").string
        },
        layout: $layout.fill,
        events: {
          didFinish: sender => {
            const content = $file.read(path).string;
            const encoded = $text.base64Encode(content);
            sender.eval({
              "script": `setText("${encoded}")`
            });
          }
        }
      }
    ],
    events: {
      appeared: () => {
        util.setSwipeBackEnabled(false);
      },
      disappeared: () => {
        util.setSwipeBackEnabled(true);
      }
    }
  });
}

function saveFile(path, handler) {
  const editor = $("editor");
  const responder = editor.runtimeValue();
  responder.$resignFirstResponder();

  editor.eval({
    "script": "getText()",
    "handler": text => {
      const file = $data({"string": text});
      $file.write({
        data: file,
        path: path
      });

      if (handler) {
        handler();
      }
    }
  });

  $device.taptic(2);
}

function runFile(path) {
  saveFile(path, () => {
    runner.run(path);
  });
}
