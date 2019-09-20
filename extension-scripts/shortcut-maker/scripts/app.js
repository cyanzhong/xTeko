var utility = require("./utility");

function init() {
  $ui.render({
    props: {
      title: $l10n("MAIN_TITLE")
    },
    views: [
      {
        type: "view",
        props: {
          id: "top-view",
          bgcolor: $color("background")
        },
        layout: function(make) {
          make.left.top.right.equalTo(0);
          make.height.equalTo(150);
        },
        views: [
          {
            type: "image",
            props: {
              id: "icon-image",
              bgcolor: $color("clear"),
              image: utility.defaultIcon(),
              smoothRadius: 17
            },
            layout: function(make, view) {
              make.centerX.equalTo(view.super);
              make.centerY.equalTo(view.super).offset(-15);
              make.size.equalTo($size(80, 80));
            }
          },
          {
            type: "button",
            props: {
              title: $l10n("SET_ICON"),
              titleColor: $color("tint"),
              bgcolor: $color("clear")
            },
            layout: function(make, view) {
              make.centerX.equalTo(view.super);
              make.bottom.inset(10);
            },
            events: {
              tapped: selectIcon
            }
          }
        ]
      },
      {
        type: "list",
        props: {
          data: [
            {
              title: $l10n("PLEASE_INPUT"),
              rows: [
                {
                  type: "input",
                  props: {
                    id: "title-input",
                    placeholder: $l10n("TITLE"),
                    bgcolor: $color("clear")
                  },
                  layout: function(make, view) {
                    make.top.bottom.equalTo(0);
                    make.left.right.inset(10)
                  },
                  events: {
                    returned: function(sender) {
                      sender.blur();
                    }
                  }
                },
                {
                  type: "input",
                  props: {
                    id: "url-input",
                    type: $kbType.url,
                    placeholder: $l10n("URL_SCHEME"),
                    bgcolor: $color("clear")
                  },
                  layout: function(make, view) {
                    make.top.bottom.equalTo(0);
                    make.left.right.inset(10);
                  },
                  events: {
                    returned: function(sender) {
                      sender.blur();
                    }
                  }
                }
              ]
            }
          ]
        },
        layout: function(make) {
          make.top.equalTo($("top-view").bottom);
          make.left.bottom.right.equalTo(0);
        }
      },
      {
        type: "button",
        props: {
          title: $l10n("MAKE")
        },
        layout: function(make) {
          make.left.right.inset(10);
          make.bottom.inset(10 + utility.dynamicInsets().bottom);
          make.height.equalTo(36);
        },
        events: {
          tapped: makeShortcut
        }
      }
    ]
  })
}

function selectIcon() {
  var options = [$l10n("BUILTIN_ICONS"), $l10n("PHOTO_LIBRARY")];
  $ui.menu(options).then(function(selected) {
    if (selected == null) {
      return;
    }
    if (selected.index == 0) {
      selectBuiltinIcons();
    } else {
      selectFromPhotoLibrary();
    }
  });
}

function selectBuiltinIcons() {
  $ui.selectIcon().then(function(name) {
    var options = [$l10n("USE_THEME_COLOR"), $l10n("SELECT_COLOR")];
    $ui.menu(options).then(function(selected) {
      if (selected == null) {
        return;
      }
      if (selected.index == 0) {
        makeIcon(name, $color("tint"));
      } else {
        var palette = require("vendor/palette/main");
        palette.show(function(color) {
          makeIcon(name, color);
        });
      }
    });
  });
}

function selectFromPhotoLibrary() {
  $photo.pick().then(function(result) {
    if (result && result.image) {
      $device.taptic(0);
      setupIcon(result.image);
    }
  });
}

function makeIcon(iconName, color) {
  var image = utility.makeIcon(iconName, color);
  if (image) {
    setupIcon(image);
  }
}

function setupIcon(image) {
  $("icon-image").image = image;
  $("title-input").focus();
}

function makeShortcut() {

  var title = $("title-input").text;
  var url = $("url-input").text;
  var icon = $("icon-image").image;

  if (title.length == 0 || url.length == 0 || icon == null) {
    return;
  }

  $system.makeIcon({ title: title, url: url, icon: icon });
}

module.exports = {
  init: init
}