let plot = require("./scripts/plot");

$ui.render({
  views: [
    {
      type: "list",
      props: {
        data: ["line", "pie", "area", "easing", "zoom", "river", "radar", "k", "3d", "sun", "wave", "sphere", "spring"]
      },
      layout: $layout.fill,
      events: {
        didSelect: (sender, indexPath, title) => {
          plot(title);
        }
      }
    }
  ]
});
