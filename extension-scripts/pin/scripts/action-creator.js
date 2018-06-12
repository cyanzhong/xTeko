var helper = require("./helper");
var nameCell = createLabelCell($l10n("ACTION_NAME"), "name-label");
var patternCell = createLabelCell($l10n("ACTION_PATTERN"), "pattern-label");

var iconCell = {
  type: "view",
  layout: $layout.fill,
  views: [
    {
      type: "label",
      props: {
        text: $l10n("ACTION_ICON")
      },
      layout: function(make, view) {
        make.centerY.equalTo(view.super);
        make.left.equalTo(15);
      }
    },
    {
      type: "image",
      props: {
        id: "icon-image",
        bgcolor: $color("clear")
      },
      layout: function(make, view) {
        make.size.equalTo($size(20, 20));
        make.centerY.equalTo(view.super);
        make.right.inset(15);
      }
    }
  ]
}

var iconName = "";

function show(completionHandler) {
  $ui.push({
    props: { title: $l10n("CREATE_ACTION") },
    views: [
      {
        type: "list",
        props: {
          data: [
            {
              "title": " ",
              "rows": [nameCell, patternCell, iconCell]
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath) {
            helper.blinkView(sender.cell(indexPath));
            if (indexPath.row == 0) {
              setName();
            } else if (indexPath.row == 1) {
              showActionMenu();
            } else {
              showIconMenu();
            }
          }
        }
      },
      {
        type: "button",
        props: {
          title: $l10n("DONE")
        },
        layout: function(make, view) {
          make.left.bottom.right.inset(8);
          make.height.equalTo(36);
        },
        events: {
          tapped: function() {
            var name = nameLabel().text;
            var pattern = patternLabel().text;
            if (name.length > 0 && pattern.length > 0 && iconName.length > 0) {
              completionHandler({
                "name": name,
                "pattern": pattern,
                "icon": iconName
              });
              $ui.pop();
            }
          }
        }
      }
    ]
  })
}

function setName() {
  $input.text().then(function(text) {
    if (text.length > 0) {
      nameLabel().text = text;
    }
  });
}

function showActionMenu() {
  var options = [$l10n("ACTION_JSBOX"), $l10n("ACTION_LIST"), $l10n("ACTION_CUSTOM")];
  $ui.menu(options).then(function(selected) {
    if (selected == undefined) {
      return;
    }
    var title = selected.title;
    if (title === $l10n("ACTION_JSBOX")) {
      var picker = require("./addin-picker");
      picker.show(function(name, scheme) {
        nameLabel().text = name;
        patternLabel().text = scheme;
      });
    } else if (title === $l10n("ACTION_LIST")) {
      var picker = require("./action-picker");
      picker.show(function(name, scheme) {
        nameLabel().text = name;
        patternLabel().text = scheme;
      });
    } else if (title === $l10n("ACTION_CUSTOM")) {
      $input.text({
        type: $kbType.url
      }).then(function(text) {
        if (text.length > 0) {
          patternLabel().text = text;
        }
      })
    }
  });
}

function createLabelCell(name, identifier) {
  return {
    type: "view",
    layout: $layout.fill,
    views: [
      {
        type: "label",
        props: {
          text: name
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super);
          make.left.equalTo(15);
        }
      },
      {
        type: "label",
        props: {
          id: identifier,
          align: $align.right
        },
        layout: function(make, view) {
          make.centerY.equalTo(view.super);
          make.right.inset(15);
          make.width.equalTo(view.super).multipliedBy(0.5);
        }
      }
    ]
  };
}

function showIconMenu() {
  var picker = require("./icon-picker");
  picker.show(function(name) {
    iconName = name;
    iconImage().icon = $icon(name);
  });
}

function nameLabel() {
  return $("name-label");
}

function patternLabel() {
  return $("pattern-label");
}

function iconImage() {
  return $("icon-image");
}

module.exports = {
  show: show
}