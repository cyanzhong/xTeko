var builder = require("./builder");
var dataManager = require("./data-manager");
var layoutUtility = require("./layout-utility");
var LIST_TYPE = { CLIPBOARD: 0, ACTION: 1 };
var listType = LIST_TYPE.CLIPBOARD;

var tabView = {
  type: "tab",
  props: {
    items: [$l10n("CLIPBOARD"), $l10n("ACTION")]
  },
  layout: function(make, view) {
    make.centerX.equalTo(view.super);
    make.width.equalTo(view.super).multipliedBy(0.5);
    make.top.inset(8);
    make.height.equalTo(28);
  },
  events: {
    changed: function(sender) {
      setListViewType(sender.index);
    }
  }
};

var clipboardView = builder.createClipboardView();
var actionView = builder.createActionView();

var createButton = {
  type: "button",
  props: {
    title: $l10n("CREATE")
  },
  layout: function(make, view) {
    make.left.right.inset(8);
    make.bottom.inset(8 + layoutUtility.dynamicInsets().bottom);
    make.height.equalTo(36);
  },
  events: {
    tapped: function() {
      if (listType == LIST_TYPE.CLIPBOARD) {
        createNewTextItem();
      } else {
        createNewActionItem();
      }
    }
  }
};

var settingButton = {
  type: "button",
  props: {
    src: "assets/setting.png"
  },
  layout: function(make, view) {
    make.size.equalTo($size(20, 20));
    make.top.right.inset(12);
  },
  events: {
    tapped: function() {
      var setting = require("./setting");
      setting.show({
        "clear": function() {
          $("clipboard-list").data = [];
          builder.reloadTextItems();
        }
      });
    }
  }
}

function init() {

  $ui.render({
    props: { title: "Pin" },
    views: [tabView, clipboardView, actionView, createButton, settingButton]
  })

  setListViewType(0);
}

function setListViewType(type) {
  listType = type;
  
  var clipboardView = $("clipboard-list");
  var actionView = $("action-list");
  
  clipboardView.hidden = type != LIST_TYPE.CLIPBOARD;
  actionView.hidden = type != LIST_TYPE.ACTION;
}

function createNewTextItem() {
  $input.text().then(function(text) {
    var items = dataManager.getTextItems();
    if (items.indexOf(text) === -1 && text.length > 0) {
      items.unshift(text);
      $("clipboard-list").insert({"index": 0, "value": text});
      dataManager.setTextItems(items);
      builder.reloadTextItems();
    }
  });
}

function createNewActionItem() {
  var creator = require("./action-creator");
  creator.create(function(action) {
    var items = dataManager.getActionItems();
    items.unshift(action);
    $("action-list").insert({
      index: 0,
      value: builder.createActionItem(action)
    });
    dataManager.setActionItems(items);
    builder.reloadActionItems();
  });
}

module.exports = {
  init: init
}