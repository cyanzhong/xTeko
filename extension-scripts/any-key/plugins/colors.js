const utility = require("scripts/utility");
const arrayHelper = require("scripts/array-helper");

var colors = $cache.get("color-list") || [
  $rgb(255, 59, 48),
  $rgb(255, 149, 0),
  $rgb(255, 204, 0),
  $rgb(76, 217, 100),
  $rgb(90, 200, 250),
  $rgb(0, 122, 255),
  $rgb(88, 86, 214),
  $rgb(255, 45, 85),
];

$ui.push({
  props: {
    title: $l10n("Colors"),
    navButtons: [
      {
        image: utility.imageNamed("bar-item-add"),
        handler: async() => {
          let color = await $picker.color();
          colors.unshift(color);
          $("color-matrix").insert({
            index: 0,
            value: {
              "color-view": {
                bgcolor: color,
                text: color.hexCode
              }
            }
          });
          saveColors();
        }
      },
    ]
  },
  views: [
    {
      type: "matrix",
      props: {
        id: "color-matrix",
        columns: 2,
        spacing: 10,
        itemHeight: 88,
        template: {
          views: [
            {
              type: "label",
              props: {
                id: "color-view",
                smoothRadius: 8,
                align: $align.center,
                textColor: $color("white")
              },
              layout: $layout.fill
            }
          ]
        },
        data: colors.map(color => {
          return {
            "color-view": {
              bgcolor: color,
              text: color.hexCode
            }
          }
        })
      },
      layout: $layout.fill,
      events: {
        didSelect: async(sender, indexPath) => {

          let canvas = $ui.create({
            type: "view",
            props: {
              frame: $rect(0, 0, 120, 120),
              bgcolor: colors[indexPath.item],
              smoothRadius: 8
            }
          });

          let image = canvas.snapshot;
          let options = [$l10n("COPY"), $l10n("SHARE"), $l10n("DELETE")];
          let {index} = await $ui.menu(options);
          if (index === 0) {
            $clipboard.image = image;
          } else if (index === 1) {
            $quicklook.open({"image": image});
          } else if (index === 2) {
            arrayHelper.remove(colors, indexPath.item);
            $("color-matrix").delete(indexPath.item);
            saveColors();
          }
        }
      }
    }
  ]
});

function saveColors() {
  $cache.set("color-list", colors);
}