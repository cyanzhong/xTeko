var data = [];

for (var idx=0; idx<192; ++idx) {
  var name = iconNameForIndex(idx);
  data.push({ icon: { icon: $icon(name) } });
}

function show(completionHandler) {

  if (typeof $ui.selectIcon === "function") {
    $ui.selectIcon().then(completionHandler);
    return;
  }

  $ui.push({
    props: {
      title: $l10n("ACTION_ICON")
    },
    views: [
      {
        type: "matrix",
        props: {
          columns: 6,
          itemHeight: 64,
          square: true,
          template: {
            views: [
              {
                type: "image",
                props: {
                  id: "icon",
                  bgcolor: $color("clear"),
                  contentMode: $contentMode.scaleAspectFit
                },
                layout: function(make, view) {
                  make.center.equalTo(view.super);
                }
              }
            ]
          },
          data: data
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath) {
            var name = iconNameForIndex(indexPath.row);
            completionHandler(name);
            $ui.pop();
          }
        }
      }
    ]
  })
}

function iconNameForIndex(index) {
  var name = "icon_" + pad(index + 1, 3) + ".png";
  return name;
}

function pad(num, size) {
  var str = num + "";
  while (str.length < size) {
    str = "0" + str;
  }
  return str;
}

module.exports = {
  show: show
}