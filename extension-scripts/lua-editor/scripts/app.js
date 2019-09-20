function init() {
  $ui.render({
    props: {
      navButtons: [
        {
          title: "Examples",
          handler: showExamples
        }
      ]
    },
    views: [
      {
        type: "web",
        props: {
          id: "editor",
          smoothRadius: 8,
          html: $file.read("assets/editor.html").string
        },
        layout: (make, view) => {
          make.left.top.right.inset(10);
          make.height.equalTo(240);
        }
      },
      {
        type: "button",
        props: {
          title: "Run",
          smoothRadius: 8,
        },
        layout: (make, view) => {
          make.height.equalTo(36);
          make.left.right.inset(10);
          make.top.equalTo($("editor").bottom).offset(10);
        },
        events: {
          tapped: run
        }
      }
    ]
  });
}

async function showExamples() {

  let list = $file.list("assets/examples");
  let selected = await $ui.menu(list);

  if (selected == undefined) {
    return;
  }

  let code = $file.read(`assets/examples/${selected.title}`).string;
  let encoded = $text.base64Encode(code);
  $("editor").eval({ script: `setText("${encoded}")` });
}

async function run() {
  let code = await $("editor").eval("getText()");
  $lua.eval(code);
}

module.exports.init = init;