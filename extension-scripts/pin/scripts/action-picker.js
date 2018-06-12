var dataManager = require("./data-manager");
var actions = dataManager.defaultActionItems();

function show(completionHandler) {
  $ui.push({
    props: { title: $l10n("ACTION_LIST") },
    views: [
      {
        type: "list",
        props: {
          data: actions.map(function(item) {
            return {
              "title": $l10n(item.name),
              "rows": item.items.map(function(item) {
                return $l10n(item.name);
              })
            };
          })
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath) {
            var action = actions[indexPath.section]["items"][indexPath.row];
            completionHandler($l10n(action.name), action.pattern);
            $ui.pop();
          }
        }
      }
    ]
  })
}

module.exports = {
  show: show
}