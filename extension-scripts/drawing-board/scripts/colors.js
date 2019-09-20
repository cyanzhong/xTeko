let colors = [
  $rgb(0, 0, 0),
  $rgb(200, 200, 200),
  $rgb(255, 59, 48),
  $rgb(255, 149, 0),
  $rgb(255, 204, 0),
  $rgb(76, 217, 100),
  $rgb(90, 200, 250),
  $rgb(0, 122, 255),
  $rgb(88, 86, 214),
  $rgb(255, 45, 85),
];

exports.select = completion => {
  $ui.push({
    props: {
      title: $l10n("COLORS")
    },
    views: [
      {
        type: "matrix",
        props: {
          id: "color-matrix",
          columns: 2,
          spacing: 5,
          itemHeight: 44,
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
          didSelect: (sender, indexPath) => {
            let color = colors[indexPath.item];
            completion(color);
            $ui.pop();
          }
        }
      }
    ]
  });
}