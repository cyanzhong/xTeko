const settings = require("./settings");
const modes = settings.modes;
const constants = {
  fonts: {
    normal: $font(17),
    selected: $font("bold", 17)
  },
  colors: {
    normal: $color("#666666"),
    selected: $color("#157efb")
  }
}

exports.open = handler => {
  const modeIndex = settings.modeIndex();
  $ui.push({
    props: {
      title: ""
    },
    views: [
      {
        type: "list",
        props: {
          id: "modes",
          template: [
            {
              type: "label",
              props: {
                id: "label"
              },
              layout: (make, view) => {
                make.centerY.equalTo(view.super);
                make.left.equalTo(15);
              }
            }
          ],
          data: modes.map((mode, index) => {
            return {
              "label": {
                "text": mode,
                "textColor": (() => {
                  if (index == modeIndex) {
                    return constants.colors.selected;
                  } else {
                    return constants.colors.normal;
                  }
                })(),
                "font": (() => {
                  if (index == modeIndex) {
                    return constants.fonts.selected;
                  } else {
                    return constants.fonts.normal;
                  }
                })()
              }
            }
          })
        },
        events: {
          ready: sender => {
            sender.scrollTo({
              indexPath: $indexPath(0, modeIndex),
              position: 1,
              animated: false
            });
          },
          didSelect: (_, indexPath) => {
            const index = indexPath.row;
            settings.setMode(index);
            handler(index);
            $ui.pop();
          }
        },
        layout: $layout.fill
      }
    ]
  });
}