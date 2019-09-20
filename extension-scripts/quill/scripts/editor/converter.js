exports.convert = (html, handler) => {
  const window = $ui.window;
  window.add({
    type: "web",
    props: {
      id: "converter",
      html: $file.read("assets/editor/quill.html").string,
      hidden: true
    },
    layout: $layout.fill,
    events: {
      didFinish: sender => {
        sender.eval({
          "script": `convertHTML('${$text.base64Encode(html)}')`
        });
      },
      didFinishRendering: contents => {
        const data = $data({"string": JSON.stringify(contents)});
        handler(data);

        const converter = $("converter");
        if (converter) {
          converter.remove();
        }
      }
    }
  });
}