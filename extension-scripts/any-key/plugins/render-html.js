let helper = require("scripts/helper");
await helper.expand();
let html = await helper.getAllText();

$ui.push({
  props: {
    title: "HTML"
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