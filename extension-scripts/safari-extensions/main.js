if ($app.env != $env.safari) {
  $ui.render({
    views: [
      {
        type: "image",
        props: {
          src: "assets/demo.jpg",
          contentMode: $contentMode.scaleAspectFit
        },
        layout: $layout.fill
      },
      {
        type: "label",
        props: {
          text: $l10n("TIPS"),
          bgcolor: $color("black"),
          textColor: $color("white"),
          align: $align.center
        },
        layout: function(make) {
          make.left.top.right.equalTo(0)
          make.height.equalTo(44)
        }
      }
    ]
  })
  return;
}

var items = [
  {
    "name": "Firebug Lite",
    "script": "firebug-lite.js"
  },
  {
    "name": "vConsole",
    "script": "vconsole.js"
  },
  {
    "name": "Eruda",
    "script": "eruda.js"
  },
  {
    "name": "Clear Images",
    "script": "clear-images.js"
  }
]

$ui.menu(items.map(function(item) {
  return item.name;
})).then(function(selected) {
  $safari.inject($file.read("scripts/" + items[selected.index].script).string);
});