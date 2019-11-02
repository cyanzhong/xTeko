const builder = require("./builder");

exports.hideKeyboard = () => {
  const app = $objc("UIApplication").$sharedApplication();
  app.$sendAction_to_from_forEvent("resignFirstResponder", null, null, null);
}

exports.successTaptic = () => {
  $thread.main({
    handler: () => {
      $objc("UINotificationFeedbackGenerator").$new().$notificationOccurred(0);
    }
  });
}

exports.processImage = data => {
  const settings = require("./settings");
  const shadowOffsetX = settings.shadowOffsetX();
  const shadowOffsetY = settings.shadowOffsetY();
  const shadowRadius = settings.shadowRadius();
  const paddingX = (shadowOffsetX * 2 + shadowRadius) * $device.info.screen.scale;
  const paddingY = (shadowOffsetY * 2 + shadowRadius) * $device.info.screen.scale;
  const image = $data({"base64": data}).image;
  const size = image.size;

  const imageView = $ui.create({
    type: "image",
    props: {
      image: image,
      frame: $rect(0, 0, size.width, size.height),
      smoothRadius: 30
    }
  });

  const shadowView = $ui.create({
    type: "view",
    props: {
      frame: imageView.frame
    },
  });

  shadowView.add(imageView);
  const layer = shadowView.ocValue().$layer();
  layer.$setShadowColor($color("black").ocValue().$CGColor());
  layer.$setShadowRadius(shadowRadius);
  layer.$setShadowOffset({"width": shadowOffsetX, "height": shadowOffsetY});
  layer.$setShadowOpacity(0.3);
  layer.$setMasksToBounds(false);

  const container = $ui.create({
    type: "view",
    props: {
      bgcolor: builder.colorWithAlpha(settings.backgroundColor(), settings.backgroundAlpha()),
      frame: $rect(0, 0, size.width + paddingX, size.height + paddingY)
    }
  });

  imageView.frame = $rect(
    Math.floor((container.frame.width - imageView.frame.width) / 2),
    Math.floor((container.frame.height - imageView.frame.height) / 2),
    imageView.frame.width,
    imageView.frame.height
  );

  container.add(shadowView);
  return container.snapshotWithScale(1);
}