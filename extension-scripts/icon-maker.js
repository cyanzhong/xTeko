$photo.pick().then(function(resp) {
  var image = resp.image;
  if (image) {
    make(image);
  }
});

function make(image) {
  var size = image.size;
  var frame = $rect(0, 0, size.width, size.height);
  var view = {
    type: "view",
    props: {
      smoothRadius: size.height / 4.7,
      frame: frame
    },
    views: [
      {
        type: "image",
        props: {
          image: image,
          frame: frame
        }
      }
    ]
  }
  var canvas = $ui.create(view);
  $quicklook.open({ "image": canvas.snapshot });
}