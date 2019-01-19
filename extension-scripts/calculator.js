$define({
  type: "CalcButton: UIButton",
  props: [
    "container",
    "label",
    "overlay"
  ],
  events: {
    initWithInfo: info => {
      self = self.$super().$init();

      self.$setTitle_forState(info.title, 0);
      self.$setBackgroundColor(info.bgcolor.runtimeValue());
      self.$setTitleColor_forState(info.titleColor.runtimeValue(), 0);
      self.$setInfo(info.coord.runtimeValue());
      let label = self.$titleLabel();
      let font = $objc("UIFont").$systemFontOfSize_weight(info.fontSize, -0.5).rawValue();
      label.$setFont(font);

      let overlay = $objc("UIView").$new();
      overlay.$setBackgroundColor($color("black").runtimeValue());
      overlay.$setAlpha(0);
      self.$addSubview(overlay);
      self.$setOverlay(overlay);

      return self;
    },
    layoutSubviews: () => {
      self.$super().$layoutSubviews();
      let overlay = self.$overlay();
      overlay.$setFrame(self.$bounds());
    },
    setHighlighted: highlighted => {
      let overlay = self.$overlay();
      let alpha = highlighted ? 0.1 : 0;
      overlay.$setAlpha(alpha);
    }
  }
});

const colors = {
  black: $color("#000000"),
  white: $color("#ffffff"),
  red: $color("#ff3b30"),
  darkBlue: $color("#37474f"),
  lightBlue: $color("#157efb"),
  lightGray: $color("#eef1f1"),
}

const symbols = {
  clear: "C",
  back: "←",
  copy: "copy",
  enter: "enter",
  dot: ".",
  plus: "﹢",
  minus: "﹣",
  times: "×",
  obelus: "÷",
  equals: "=",
}

$ui.render({
  props: {
    title: "JCalc"
  },
  views: [
    {
      type: "view",
      props: {
        id: "container",
        bgcolor: colors.darkBlue
      },
      layout: (make, view) => {
        make.left.top.right.equalTo(0);
        if ($app.env == $env.app || $app.env == $env.action) {
          make.height.equalTo(110);
        } else {
          make.bottom.equalTo(0);
        }
      },
      events: {
        layoutSubviews: view => {

          let subviews = view.views;
          let width = view.frame.width;
          let height = view.frame.height;
          let inset = 1.0 / $device.info.screen.scale;
          let itemWidth = (width - 9 * inset) / 10;
          let itemHeight = Math.min(itemWidth, (height - 2 * inset) / 3);

          for (const subview of subviews) {
            let coord = subview.info;
            if (coord) {
              let row = coord[0];
              let col = coord[1];
              let y = height - (row == 0 ? (itemHeight * 2 + inset) : itemHeight);
              let x = col * (itemWidth + inset);
              subview.frame = $rect(x, y, itemWidth, itemHeight);
            }
          }

          let gradient = $("gradient-layer");
          gradient.frame = $rect(0, 0, width, height - (itemHeight * 2 + inset));
        }
      }
    },
    {
      type: "gradient",
      props: {
        id: "gradient-layer",
        colors: [colors.black, colors.darkBlue],
        locations: [0.0, 1.0],
        startPoint: $point(0, 0.5),
        endPoint: $point(0, 1)
      },
      views: [
        {
          type: "label",
          props: {
            id: "result-label",
            text: "0",
            font: (() => {
              let size = $app.env == $env.keyboard ? 64 : 32;
              let font = $objc("UIFont").$systemFontOfSize(size);
              return font.rawValue();
            })(),
            textColor: colors.white,
            align: $align.right
          },
          layout: (make, view) => {
            make.top.bottom.equalTo(0);
            make.left.right.inset(8);
          }
        }
      ]
    }
  ]
});

let container = $("container");
container.add(newButton("1", [0, 0], colors.white, colors.darkBlue, 18));
container.add(newButton("2", [0, 1], colors.white, colors.darkBlue, 18));
container.add(newButton("3", [0, 2], colors.white, colors.darkBlue, 18));
container.add(newButton("4", [0, 3], colors.white, colors.darkBlue, 18));
container.add(newButton("5", [0, 4], colors.white, colors.darkBlue, 18));
container.add(newButton("6", [0, 5], colors.white, colors.darkBlue, 18));
container.add(newButton("7", [0, 6], colors.white, colors.darkBlue, 18));
container.add(newButton("8", [0, 7], colors.white, colors.darkBlue, 18));
container.add(newButton("9", [0, 8], colors.white, colors.darkBlue, 18));
container.add(newButton("0", [0, 9], colors.white, colors.darkBlue, 18));
container.add(newButton(symbols.clear, [1, 0], colors.lightGray, colors.red, 18));
container.add(newButton(symbols.back, [1, 1], colors.lightGray, colors.red, 18));
container.add(newButton(symbols.copy, [1, 2], colors.lightGray, colors.darkBlue, 15));
container.add(newButton(symbols.enter, [1, 3], colors.lightGray, colors.darkBlue, 15));
container.add(newButton(symbols.dot, [1, 4], colors.lightGray, colors.darkBlue, 20));
container.add(newButton(symbols.plus, [1, 5], colors.lightBlue, colors.white, 23));
container.add(newButton(symbols.minus, [1, 6], colors.lightBlue, colors.white, 23));
container.add(newButton(symbols.times, [1, 7], colors.lightBlue, colors.white, 23));
container.add(newButton(symbols.obelus, [1, 8], colors.lightBlue, colors.white, 23));
container.add(newButton(symbols.equals, [1, 9], colors.lightBlue, colors.white, 23));

function newButton(title, coord, bgcolor, titleColor, fontSize) {

  let button = $objc("CalcButton").$alloc().$initWithInfo({
    title: title,
    coord: coord,
    bgcolor: bgcolor,
    titleColor: titleColor,
    fontSize: fontSize,
  });

  return {
    type: "runtime",
    props: {
      view: button
    },
    events: {
      tapped: tapped
    }
  }
}

function tapped(sender) {
  $device.taptic();
  $keyboard.playInputClick();

  let key = sender.title;
  let label = $("result-label");
  let text = label.text;
  let number = parseInt(text);
  let isInvalid = isNaN(number) || text === "0" || !isFinite(number);

  if (key === symbols.clear) {
    label.text = "0";
  } else if (key === symbols.back) {
    if (text.length === 1 || isInvalid) {
      label.text = "0";
    } else {
      label.text = text.substring(0, text.length - 1);
    }
  } else if (key === symbols.copy) {
    $clipboard.text = text;
  } else if (key === symbols.enter) {
    $keyboard.insert(text);
  } else if (key === symbols.dot) {
    if (text.indexOf(key) === -1) {
      label.text = text + key;
    }
  } else if (key === symbols.equals) {
    try {
      var formula = text;
      formula = formula.replace(symbols.plus, "+");
      formula = formula.replace(symbols.minus, "-");
      formula = formula.replace(symbols.times, "*");
      formula = formula.replace(symbols.obelus, "/");
      label.text = eval(formula);
    } catch(err) {
      label.text = "Error";
    }
  } else if (
    key === symbols.plus ||
    key === symbols.minus ||
    key === symbols.times ||
    key === symbols.obelus) {
    label.text = text + key;
  } else {
    if (isInvalid) {
      label.text = key;
    } else {
      label.text = text + key;
    }
  }
}