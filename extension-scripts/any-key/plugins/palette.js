const helper = require("scripts/helper");
const rowHeight = 42;
const rowInset = 6;

let text = helper.getText();
let rgbMatches = text.match(/(\d+)[^\d]+(\d+)[^\d]+(\d+)/);
let hexMatches = text.match(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/);
var redValue = -1;
var greenValue = -1;
var blueValue = -1;

if (rgbMatches && rgbMatches.length > 3) {
  redValue = parseInt(rgbMatches[1]);
  greenValue = parseInt(rgbMatches[2]);
  blueValue = parseInt(rgbMatches[3]);
} else if (hexMatches && hexMatches.length > 3) {
  redValue = parseInt(hexMatches[1], 16);
  greenValue = parseInt(hexMatches[2], 16);
  blueValue = parseInt(hexMatches[3], 16);
}

$ui.push({
  props: {
    title: $l10n("Palette")
  },
  views: [
    {
      type: "view",
      props: {
        id: "result-view",
        smoothRadius: 6
      },
      layout: (make, view) => {
        make.left.top.equalTo(rowInset);
        make.size.equalTo($size(120, rowHeight * 3));
      },
      events: {
        tapped: async(sender) => {
          let options = [$l10n("COPY"), $l10n("SHARE")];
          let {index} = await $ui.menu(options);
          let image = sender.snapshot;
          if (index === 0) {
            $clipboard.image = image;
          } else {
            $quicklook.open({"image": image});
          }
        }
      }
    },
    {
      type: "label",
      props: {
        id: "red-label",
        text: "Red",
        align: $align.center
      },
      layout: (make, view) => {
        make.top.equalTo(rowInset);
        make.left.equalTo(128);
        make.size.equalTo($size(64, rowHeight));
      }
    },
    {
      type: "label",
      props: {
        id: "green-label",
        text: "Green",
        align: $align.center
      },
      layout: (make, view) => {
        make.top.equalTo(rowHeight + rowInset);
        make.left.equalTo(128);
        make.size.equalTo($size(64, rowHeight));
      }
    },
    {
      type: "label",
      props: {
        id: "blue-label",
        text: "Blue",
        align: $align.center
      },
      layout: (make, view) => {
        make.top.equalTo(rowHeight * 2 + rowInset);
        make.left.equalTo(128);
        make.size.equalTo($size(64, rowHeight));
      }
    },
    {
      type: "slider",
      props: {
        id: "red-slider",
        min: 0,
        max: 255,
        value: redValue >= 0 ? redValue : $cache.get("palette-red") || 100
      },
      layout: (make, view) => {
        make.right.inset(10);
        make.centerY.equalTo($("red-label"));
        make.left.equalTo($("red-label").right);
      },
      events: {
        changed: sliderChanged
      }
    },
    {
      type: "slider",
      props: {
        id: "green-slider",
        min: 0,
        max: 255,
        value: greenValue >= 0 ? greenValue : $cache.get("palette-green") || 100
      },
      layout: (make, view) => {
        make.right.inset(10);
        make.centerY.equalTo($("green-label"));
        make.left.equalTo($("green-label").right);
      },
      events: {
        changed: sliderChanged
      }
    },
    {
      type: "slider",
      props: {
        id: "blue-slider",
        min: 0,
        max: 255,
        value: blueValue >= 0 ? blueValue : $cache.get("palette-blue") || 100
      },
      layout: (make, view) => {
        make.right.inset(10);
        make.centerY.equalTo($("blue-label"));
        make.left.equalTo($("blue-label").right);
      },
      events: {
        changed: sliderChanged
      }
    },
    {
      type: "button",
      props: {
        id: "rgb-button",
        font: $font("medium", 14),
        bgcolor: $color("#bdc1c6"),
        titleColor: $color("black"),
        smoothRadius: 6
      },
      events: {
        tapped: sender => helper.setText(sender.title)
      },
      layout: (make, view) => {
        make.left.equalTo(rowInset);
        make.top.equalTo($("result-view").bottom).offset(rowInset);
        make.width.equalTo(view.super).multipliedBy(0.5).offset(-rowInset * 1.5);
      }
    },
    {
      type: "button",
      props: {
        id: "hex-button",
        font: $font("medium", 14),
        bgcolor: $color("#bdc1c6"),
        titleColor: $color("black"),
        smoothRadius: 6
      },
      events: {
        tapped: sender => helper.setText(sender.title)
      },
      layout: (make, view) => {
        make.right.inset(rowInset);
        make.top.equalTo($("rgb-button"));
        make.width.equalTo($("rgb-button"));
      }
    }
  ]
});

function sliderChanged() {

  let red = $("red-slider").value;
  let green = $("green-slider").value;
  let blue = $("blue-slider").value;

  $cache.set("palette-red", red);
  $cache.set("palette-green", green);
  $cache.set("palette-blue", blue);

  let color = $rgb(red, green, blue);
  $("result-view").bgcolor = color;

  let components = color.components;
  $("rgb-button").title = `rgb(${components.red}, ${components.green}, ${components.blue})`;
  $("hex-button").title = color.hexCode;
}

sliderChanged();