let html = $file.read("assets/index.html").string;

$ui.render({
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