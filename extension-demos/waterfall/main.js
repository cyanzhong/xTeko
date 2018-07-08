var sizes = [
  $size(550, 850),
  $size(1000, 665),
  $size(1024, 689),
  $size(640, 427),
];

var cats = ["cat1.jpg", "cat2.jpg", "cat3.jpg", "cat4.jpg"];
var data = [];

for (var idx=0; idx<64; ++idx) {
  data.push({
    image: {
      src: "assets/" + cats[idx % 4]
    }
  });
}

$ui.render({
  views: [
    {
      type: "matrix",
      props: {
        columns: 3,
        spacing: 5,
        waterfall: true,
        template: {
          views: [
            {
              type: "image",
              props: {
                id: "image"
              },
              layout: $layout.fill
            }
          ]
        },
        data: data
      },
      layout: $layout.fill,
      events: {
        itemSize: function(sender, indexPath) {
          return sizes[indexPath.item % 4];
        }
      }
    }
  ]
})