var helper = require("./helper");
var settings = require("./settings");

var options = [
  {
    "name": $l10n("FROM_CLIPBOARD"),
    "action": function() {
      var json = helper.parseJson($clipboard.text || "{}");
      if (json) {
        helper.renderJson(json);
      }
    }
  },
  {
    "name": $l10n("RUN_API"),
    "action": function() {
      $input.text({
        type: $kbType.url,
        placeholder: $l10n("PLEASE_ENTER_THE_API"),
        text: $clipboard.link || ""
      }).then(function(url) {
        return url.length > 0 ? $http.get(url) : null;
      }).then(function(resp) {
        helper.renderJson(resp.data);
      })
    }
  },
  {
    "name": $l10n("THEME"),
    "action": function() {
      settings.show();
    }
  }
]

function init() {
  $ui.render({
    props: { title: $l10n("MAIN_TITLE") },
    views: [
      {
        type: "list",
        props: {
          data: [
            {
              title: $l10n("PRO_TIP"),
              rows: options.map(function(item) {
                return item.name
              })
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath) {
            var index = indexPath.row;
            options[index].action();
          }
        }
      }
    ]
  })
}

module.exports = {
  init: init
}