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
  initActionButtons();
}

function createButton(title, layout, handler) {
  return {
    type: "button",
    props: {
      title: title,
      titleColor: $color("tint"),
      font: $font("bold", 16),
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

  var container = {
    type: "scroll",
    props: {
      id: "action-view",
      bgcolor: $rgba(200, 200, 200, 0.25),
      radius: 5,
      alwaysBounceVertical: false,
      alwaysBounceHorizontal: true,
      showsHorizontalIndicator: false
    },
    layout: function(make, view) {
      make.left.bottom.right.inset(6);
      make.height.equalTo(36);
    },
    views: views
  };

  return container;
}

function initActionButtons() {
  
  var actionView = $("action-view");
  actionView.relayout();

  var actions = dataManager.getActionItems();
  var itemHeight = 36;
  var leftView;
  var multiplyRatio = 1.0 / Math.min(actions.length, 6);
  var contentWidth = 0;

  for (var idx=0; idx<actions.length; ++idx) {
    var action = actions[idx];
    var button = {
      type: "button",
      props: {
        bgcolor: $color("clear"),
        icon: $icon(action.icon, $color("darkText"), $size(20, 20)),
        info: { pattern: action.pattern }
      },
      layout: function(make, view) {
        if (leftView) {
          make.left.equalTo(leftView.right);
        } else {
          make.left.equalTo(0);
        }
        make.top.equalTo(0);
        make.height.equalTo(itemHeight);
        make.width.equalTo(view.super).multipliedBy(multiplyRatio);
        contentWidth = (actionView.frame.width - 12) * multiplyRatio * actions.length;
        leftView = view;
      },
      events: {
        tapped: function(sender) {
          $device.taptic(1);
          helper.openURL(sender.info.pattern);
        }
      }
    }
    actionView.add(button);
  }

  actionView.contentSize = $size(contentWidth, itemHeight);
}

module.exports = {
  init: init
}