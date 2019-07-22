$objc("NSBundle").$bundleWithPath("/System/Library/PrivateFrameworks/MobileTimer.framework").$load();
$objc("NSBundle").$bundleWithPath("/System/Library/PrivateFrameworks/MobileTimerUI.framework").$load();

let screen = $device.info.screen;
let itemHeight = 44;
let lineHeight = 1.0 / screen.scale;
let scaleRatio = 0.5;
let ios13 = parseInt($device.info.version.split(".")[0]) >= 13;

$define({
  type: "ClockView: MTUIWorldClockCellView",
  props: ["lineView", "index"],
  events: {
    layoutSubviews: () => {
      self.$ORIGlayoutSubviews();

      let combinedLabel = self.$combinedLabel();
      combinedLabel.$sizeToFit();
      combinedLabel.$setFrame({"x": 10, "y": 4, "width": combinedLabel.$frame().width, "height": combinedLabel.$frame().height});

      let nameLabel = self.$nameLabel();
      nameLabel.$sizeToFit();
      nameLabel.$setFrame({"x": 10, "y": combinedLabel.$frame().height + combinedLabel.$frame().y + 1, "width": nameLabel.$frame().width, "height": nameLabel.$frame().height});

      let digitalClock = self.$digitalClock();
      let offset = ios13 ? -14 : 4;
      digitalClock.$setFrame({"x": self.$frame().width - digitalClock.$frame().width - 10, "y": offset, "width": digitalClock.$frame().width, "height": digitalClock.$frame().height});

      if (ios13) {
        combinedLabel.$setTextColor($color("darkGray").runtimeValue());
        digitalClock.$setTextColor($color("white").runtimeValue());
      }

      let lineView = self.$lineView();
      lineView.$setFrame({"x": 0, "y": self.$frame().height - lineHeight, "width": self.$frame().width, "height": lineHeight});
    } 
  }
});

$define({
  type: "ContainerView: UIScrollView",
  events: {
    layoutSubviews: () => {
      self.$ORIGlayoutSubviews();

      let subviews = self.$subviews();
      for (let idx=0; idx<subviews.$count(); ++idx) {
        let view = subviews.$objectAtIndex(idx);
        if (view.__clsName === "ClockView") {
          let clockView = view;
          clockView.$setFrame({"x": 0, "y": itemHeight * clockView.$index(), "width": self.$frame().width, "height": itemHeight}); 
        }
      }
    }
  }
});

let manager = $objc("WorldClockManager").$sharedManager();
manager.$loadCities();
let cities = manager.$cities();

let scrollView = $objc("ContainerView").$new();
scrollView.$setAlwaysBounceVertical(true);
scrollView.$setBackgroundColor($color("#171717").runtimeValue());
scrollView.$setContentSize({"width": 0, "height": cities.$count() * itemHeight});

for (var idx=0; idx<cities.$count(); ++idx) {

  let city = cities.$objectAtIndex(idx);
  let timeZone = $objc("NSTimeZone").$alloc().$initWithName(city.$timeZone());

  let clockView = $objc("ClockView").$new();
  clockView.$setIndex(idx);
  clockView.$setTimeZone(timeZone);
  clockView.$setBackgroundColor($color("#171717").runtimeValue());
  clockView.$start();
  scrollView.$addSubview(clockView);

  let nameLabel = clockView.$nameLabel();
  let digitalClock = clockView.$digitalClock();

  nameLabel.$setText(city.$name());
  nameLabel.$scale(scaleRatio);
  digitalClock.$scale(scaleRatio);

  let lineView = $objc("UIView").$new();
  lineView.$setBackgroundColor($color("#333333").runtimeValue());

  clockView.$setLineView(lineView);
  clockView.$addSubview(lineView);
}

$ui.render({
  views: [
    {
      type: "runtime",
      props: {
        view: scrollView
      },
      layout: $layout.fill
    }
  ]
});
