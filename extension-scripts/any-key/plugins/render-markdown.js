let helper = require("scripts/helper");
await helper.expand();
let markdown = await helper.getAllText();

$ui.push({
  props: {
    title: "Markdown"
  },
  views: [
    {
      type: "markdown",
      props: {
        content: markdown
      },
      layout: $layout.fill
    }
  ]
});