function init(completionHandler) {
  $ui.push({
    props: {
      title: $l10n("SEARCH")
    },
    views: [
      {
        type: "input",
        props: {
          id: "search-input",
          placeholder: $l10n("APP_NAME")
        },
        layout: function(make, view) {
          make.left.right.top.inset(10)
          make.height.equalTo(32)
        },
        events: {
          ready: function(sender) {
            sender.focus()
          },
          returned: function(sender) {
            sender.blur()
            search(sender.text)
          }
        }
      },
      {
        type: "list",
        props: {
          id: "search-list",
          template: require("scripts/template").list,
          rowHeight: 72
        },
        layout: function(make, view) {
          make.top.equalTo($("search-input").bottom).offset(10)
          make.left.bottom.right.equalTo(0)
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            completionHandler({
              "name": data["app-name-label"]["text"],
              "id": data["bundle-id-label"]["text"],
              "icon": data["app-icon-image"]["src"]
            })
            $ui.pop()
          }
        }
      }
    ]
  })
}

function search(text) {
  $ui.loading(true)
  $http.get({
    url: `https://itunes.apple.com/search?term=${encodeURI(text)}&country=cn&entity=software`,
    handler: function(resp) {
      $ui.loading(false)
      var results = resp.data.results.slice(0, 10)
      $("search-list").data = results.map(function(item) {
        return {
          "app-icon-image": { src: item.artworkUrl512 },
          "app-name-label": { text: item.trackCensoredName },
          "bundle-id-label": { text: item.bundleId }
        }
      })
    }
  })
}

module.exports = {
  init: init
}