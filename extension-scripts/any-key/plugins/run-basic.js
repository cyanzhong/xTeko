let helper = require("scripts/helper");
let text = await helper.getAllText();
let html = $file.read("assets/basic.html").string.replace("{{code}}", text);

$ui.push({
  props: {
    title: "BASIC"
  },
  views: [
    {
      type: "web",
      props: {
        html: html
      },
      layout: $layout.fill
    }
  ]
});