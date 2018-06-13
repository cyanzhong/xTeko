var dataManager = require("./data-manager");
var builder = require("./builder");
var helper = require("./helper");
var textItems = dataManager.getTextItems();

var views = [
  createButton($l10n("CREATE"), function(make, view) {
    make.left.top.inset(6);
    make.height.equalTo(32);
    make.width.equalTo(view.super).multipliedBy(0.5).offset(-9);
  }, function() {
    $input.text().then(function(text) {
      if (textItems.indexOf(text) === -1 && text.length > 0) {
        textItems.unshift(text);
        $("clipboard-list").insert({"index": 0, "value": text});
        dataManager.setTextItems(textItems);
        builder.reloadTextItems();
      }
    });
  }),
  createButton($l10n("CLEAR"), function(make, view) {
    make.right.top.inset(6);
    make.height.equalTo(32);
    make.width.equalTo(view.super).multipliedBy(0.5).offset(-9);
  }, function() {
    $ui.menu([$l10n("CLEAR")]).then(function(selected) {
      if (selected.title.length > 0) {
        textItems = [];
        $("clipboard-list").data = [];
        $clipboard.clear();
        dataManager.clearTextItems();
      }
    });
  }),
  createClipboardView(),
  createActionView()
];

function init() {
  $ui.render({ views: views });
}

function createButton(title, layout, handler) {
  return {
    type: "button",
    props: {
      title: title,
      titleColor: $color("tint"),
      font: $font(15),
      bgcolor: $rgba(200, 200, 200, 0.25)
    },
    layout: layout,
    events: { tapped: handler }
  }
}

function createClipboardView() {
  return builder.createClipboardView();
}

function createActionView() {

  var actions = dataManager.getActionItems();
  var views = [];
  var margin = 15;
  var itemHeight = 36;
  var leftPosition = margin;

  for (var idx=0; idx<actions.length; ++idx) {
    var action = actions[idx];
    var button = {
      type: "button",
      props: {
        bgcolor: $color("clear"),
        icon: $icon(action.icon, $color("darkText"), $size(24, 24)),
        frame: $rect(leftPosition, 0, itemHeight, itemHeight),
        info: { pattern: action.pattern }
      },
      events: {
        tapped: function(sender) {
          $device.taptic(2);
          helper.openURL(sender.info.pattern);
        }
      }
    }
    views.push(button);
    leftPosition += itemHeight + margin;
  }

  var container = {
    type: "scroll",
    props: {
      bgcolor: $rgba(200, 200, 200, 0.25),
      radius: 5,
      alwaysBounceVertical: false,
      alwaysBounceHorizontal: true,
      contentSize: $size(leftPosition, itemHeight)
    },
    layout: function(make, view) {
      make.left.bottom.right.inset(6);
      make.height.equalTo(itemHeight);
    },
    views: views
  };

  return container;
}

module.exports = {
  init: init
}