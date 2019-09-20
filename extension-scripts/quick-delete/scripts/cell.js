const util = require("./util");

$define({
  type: "PhotosWaterfallCell: UICollectionViewCell",
  props: ["assetIdentifier", "imageView", "overlayView", "checkmarkView"],
  events: {
    "initWithFrame:": frame => {
      self = self.$super().$initWithFrame(frame);
      self.$setBackgroundColor($color("white").ocValue());

      const layer = self.$layer();
      layer.$setBorderWidth(1.0 / $device.info.screen.scale);
      layer.$setBorderColor($color("#DDDDDD").ocValue().$CGColor());

      const imageView = $objc("UIImageView").$new();
      self.$setImageView(imageView);
      self.$contentView().$addSubview(imageView);

      const overlayView = $objc("UIView").$new();
      overlayView.$setBackgroundColor($color("black").ocValue());
      overlayView.$setAlpha(0.5);
      overlayView.$setHidden(true);
      self.$setOverlayView(overlayView);
      self.$contentView().$addSubview(overlayView);

      const checkmarkImage = util.loadImage("checkmark");
      const checkmarkView = $objc("UIImageView").$alloc().$initWithImage(checkmarkImage);
      checkmarkView.$setHidden(true);
      self.$setCheckmarkView(checkmarkView);
      self.$contentView().$addSubview(checkmarkView);

      return self;
    },
    "layoutSubviews": () => {
      self.$super().$layoutSubviews();

      const bounds = self.$contentView().$bounds();
      self.$imageView().$setFrame(bounds);
      self.$overlayView().$setFrame(bounds);
      self.$checkmarkView().$setCenter({"x": bounds.width - 20, "y": bounds.height - 20});
    },
    "setImage:": image => {
      self.$imageView().$setImage(image);
    },
    "setSelected:": selected => {
      self.$overlayView().$setHidden(!selected);
      self.$checkmarkView().$setHidden(!selected);
    },
    "prepareForReuse": () => {
      self.$super().$prepareForReuse();
      self.$imageView().$setImage(null);
      self.$setSelected(false);
    }
  }
});