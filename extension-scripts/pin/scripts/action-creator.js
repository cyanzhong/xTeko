var helper = require("./helper");
var layoutUtility = require("./layout-utility");
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

function create(completionHandler) {
  show(completionHandler, {});
}

function edit(action, completionHandler) {
  show(completionHandler, action);
}

function show(completionHandler, action) {

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
          make.left.right.inset(8);
          make.bottom.inset(8 + layoutUtility.dynamicInsets().bottom);
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

  nameLabel().text = action["name"] || "";
  patternLabel().text = action["pattern"] || "";
  iconName = action["icon"] || "";
  
  if (iconName.length > 0) {
    iconImage().icon = $icon(iconName);
  }
}

function setName() {
  $input.text({
    text: nameLabel().text || ""
  }).then(function(text) {
    if (text && text.length > 0) {
      nameLabel().text = text;
    }
  });
}

function showActionMenu() {

  var options = [$l10n("ACTION_JSBOX"), $l10n("ACTION_LIST"), $l10n("ACTION_SHARE"), $l10n("ACTION_CUSTOM")];

  $ui.menu(options).then(function(selected) {

    if (selected == undefined) {
      return;
    }

    var title = selected.title;

    function showPicker(path) {
      var picker = require(path);
      picker.show(function(name, scheme) {
        nameLabel().text = name;
        patternLabel().text = scheme;
      });
    }

    if (title === $l10n("ACTION_JSBOX")) {
      showPicker("./addin-picker");
    } else if (title === $l10n("ACTION_LIST")) {
      showPicker("./action-picker");
    } else if (title === $l10n("ACTION_SHARE")) {
      showPicker("./extension-picker");
    } else if (title === $l10n("ACTION_CUSTOM")) {
      $input.text({
        type: $kbType.url,
        text: patternLabel().text || ""
      }).then(function(text) {
        if (text && text.length > 0) {
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
  create: create,
  edit: edit,
}