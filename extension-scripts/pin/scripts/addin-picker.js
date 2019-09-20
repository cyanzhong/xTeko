var addins = $addin.list;

function show(completionHandler) {
  $ui.push({
    views: [
      {
        type: "list",
        props: {
          data: addins.map(function(item) {
            return item.displayName;
          })
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath) {
            var addin = addins[indexPath.row];
            completionHandler(addin.displayName, "jsbox://run?name=" + encodeURIComponent(addin.displayName));
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