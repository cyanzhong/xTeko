const constants = require("./constants");
const colors = require("./colors");
const fonts = require("./fonts");

exports.run = path => {
  $ui.push({
    props: {
      title: path.split("/").pop(),
      bgcolor: colors.darkGray
    },
    views: [
      {
        type: "web",
        props: {
          id: "runner",
          url: `http://localhost:${constants.port}/index.html`,
          showsProgress: false,
          hidden: true
        },
        layout: $layout.fill,
        events: {
          onload: () => {
            const runner = $("runner");
            const code = $file.read(path);
            if (runner) {
              runner.eval({
                "script": `runCode('${$text.base64Encode(code)}')`,
                "handler": result => {
                  const screen = $("screen");
                  if (screen) {
                    screen.text = result;
                    $ui.loading(false);
                  }
                }
              });
            }
          }
        }
      },
      {
        type: "text",
        props: {
          id: "screen",
          bgcolor: colors.darkGray,
          textColor: colors.textColor,
          font: fonts.regular(),
          editable: false,
          keyboardDismissMode: 0
        },
        layout: (make, view) => {
          make.top.equalTo(view.super.safeAreaTop);
          make.bottom.equalTo(view.super.safeAreaBottom);
          make.left.equalTo(view.super.safeAreaLeft);
          make.right.equalTo(view.super.safeAreaRight);
        }
      }
    ]
  });

  $ui.loading(true);
}