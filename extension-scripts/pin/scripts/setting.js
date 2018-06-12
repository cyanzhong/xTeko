var dataManager = require("./data-manager");
var mHandlers = {};

var SETTINGS = {
  SEARCH_ENGINE: 0,
  CLEAR_CLIPBOARD: 1,
}

function show(handlers) {
  mHandlers = handlers;
  $ui.push({
    props: { title: $l10n("SETTINGS") },
    views: [
      {
        type: "list",
        props: {
          data: [
            {
              "title": " ",
              "rows": [$l10n("SEARCH_ENGINE"), $l10n("CLEAR_CLIPBOARD")]
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath) {
            switch (indexPath.row) {
            case SETTINGS.SEARCH_ENGINE:
              setEngine();
              break;
            case SETTINGS.CLEAR_CLIPBOARD:
              clearClipboard();
              break;
            }
          }
        }
      }
    ]
  })
}

function setEngine() {

  var engines = [
    {
      "name": $l10n("AS_DEFAULT"),
      "pattern": "x-web-search://?"
    },
    {
      "name": $l10n("AS_GOOGLE"),
      "pattern": "https://www.google.com/#newwindow=1&q="
    },
    {
      "name": $l10n("AS_BING"),
      "pattern": "http://cn.bing.com/search?q="
    },
    {
      "name": $l10n("AS_BAIDU"),
      "pattern": "https://www.baidu.com/s?wd="
    }
  ];

  $ui.menu(engines.map(function(item) {
    return item.name;
  })).then(function(selected) {
    if (selected == undefined) {
      return;
    }
    dataManager.setSearchEngine(engines[selected.index].pattern);
  });
}

function clearClipboard() {
  $ui.menu([$l10n("CLEAR")]).then(function(selected) {
    if (selected.title.length > 0) {
      $device.taptic(2);
      $clipboard.clear();
      dataManager.clearTextItems();
      var handler = mHandlers["clear"];
      if (handler) {
        handler();
      }
    }
  });
}

module.exports = {
  show: show
}