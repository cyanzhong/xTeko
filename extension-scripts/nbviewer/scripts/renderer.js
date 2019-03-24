const constants = require("./constants");
const colors = require("./colors");
const fonts = require("./fonts");

exports.load = path => {
  $ui.push({
    props: {
      title: path.split("/").pop()
    },
    views: [
      {
        type: "web",
        props: {
          id: "renderer",
          url: `http://localhost:${constants.port}/index.html`,
          showsProgress: false
        },
        layout: $layout.fill,
        events: {
          didFinish: () => {
            const renderer = $("renderer");
            if (renderer) {
              renderer.eval({
                "script": `render('./${path.substr(4)}')`
              });
            }
          }
        }
      }
    ]
  });
}