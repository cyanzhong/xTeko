var constants = require("scripts/constants")
var template = require("scripts/template")
var helper = require("scripts/helper")

var entities = constants.entities
var countries = constants.countries
var entity = entities[0]
var country = countries[0]
var results = []

function search(text) {
  $ui.loading(true)
  $http.get({
    url: `https://itunes.apple.com/search?term=${encodeURI(text)}&entity=${entity.code}&country=${country.code}`,
    handler: function(resp) {
      $ui.loading(false)
      results = resp.data.results.slice(0, 20)
      console.log(results)
      $("result-list").data = results.map(function(item) {
        return template.convert(item)
      })
    }
  })
}

function showActions(index) {

  const ACTIONS = {
    GET_ICON: $l10n("GET_ICON"),
    GET_SCREENSHOTS: $l10n("GET_SCREENSHOTS"),
    GET_IPAD_SCREENSHOTS: $l10n("GET_IPAD_SCREENSHOTS"),
    SHOW_DETAILS: $l10n("SHOW_DETAILS"),
    OPEN_APP_STORE: $l10n("OPEN_APP_STORE"),
    OPEN_COLLECTION: $l10n("OPEN_COLLECTION"),
    OPEN_ARTIST_VIEW: $l10n("OPEN_ARTIST_VIEW"),
    OPEN_TRACK_VIEW: $l10n("OPEN_TRACK_VIEW"),
    OPEN_PREVIEW: $l10n("OPEN_PREVIEW"),
  }

  var items = []

  if (entity.code === "software") {
    items = [ACTIONS.GET_ICON, ACTIONS.GET_SCREENSHOTS, ACTIONS.GET_IPAD_SCREENSHOTS, ACTIONS.SHOW_DETAILS, ACTIONS.OPEN_APP_STORE]
  } else if (entity.code === "podcast") {
    items = [ACTIONS.GET_ICON, ACTIONS.SHOW_DETAILS, ACTIONS.OPEN_COLLECTION]
  } else {
    items = [ACTIONS.GET_ICON, ACTIONS.SHOW_DETAILS, ACTIONS.OPEN_COLLECTION, ACTIONS.OPEN_ARTIST_VIEW, ACTIONS.OPEN_TRACK_VIEW, ACTIONS.OPEN_PREVIEW]
  }
  
  var handler = function(action) {
    var item = results[index]
    if (action === ACTIONS.GET_ICON) {
      helper.getIcon(item)
    } else if (action === ACTIONS.GET_SCREENSHOTS) {
      helper.getScreenshots(item)
    } else if (action === ACTIONS.GET_IPAD_SCREENSHOTS) {
      helper.getIpadScreenshots(item)
    } else if (action === ACTIONS.SHOW_DETAILS) {
      helper.showDetails(item)
    } else if (action === ACTIONS.OPEN_APP_STORE) {
      helper.openAppStore(country, item)
    } else if (action === ACTIONS.OPEN_COLLECTION) {
      helper.openCollection(item)
    } else if (action === ACTIONS.OPEN_ARTIST_VIEW) {
      helper.openArtistView(item)
    } else if (action === ACTIONS.OPEN_TRACK_VIEW) {
      helper.openTrackView(item)
    } else if (action === ACTIONS.OPEN_PREVIEW) {
      helper.openPreview(item)
    }
  }

  $ui.menu({ items: items, handler: handler })
}

module.exports.render = function render() {
  $ui.render({
    props: {
      title: $l10n("ITUNES_SEARCH")
    },
    views: [
      {
        type: "tab",
        props: {
          items: entities.map(function(item) { return item.name })
        },
        layout: function(make, view) {
          make.left.top.inset(10)
          make.right.inset(100)
        },
        events: {
          changed: function(sender) {
            entity = entities[sender.index]
            var searchBar = $("search-bar")
            searchBar.blur()
            search(searchBar.text)
          }
        }
      },
      {
        type: "button",
        props: {
          title: country.name,
          titleColor: $color("tint"),
          radius: 4,
          bgcolor: $color("white"),
          borderColor: $color("tint"),
          borderWidth: 1
        },
        layout: function(make, view) {
          make.right.inset(10)
          make.top.bottom.equalTo($("tab"))
          make.left.equalTo($("tab").right).offset(10)
        },
        events: {
          tapped: function(sender) {
            $ui.menu({
              items: countries.map(function(item) { return item.name }),
              handler: function(title, idx) {
                sender.title = title
                country = countries[idx]
                var searchBar = $("search-bar")
                searchBar.blur()
                search(searchBar.text)
              }
            })
          }
        }
      },
      {
        type: "input",
        props: {
          id: "search-bar",
          placeholder: $l10n("SEARCH")
        },
        layout: function(make, view) {
          make.left.right.inset(10)
          make.top.equalTo($("tab").bottom).offset(10)
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
          id: "result-list",
          template: template.list,
          rowHeight: 100
        },
        layout: function(make, view) {
          make.top.equalTo($("search-bar").bottom).offset(10)
          make.left.bottom.right.equalTo(0)
        },
        events: {
          didSelect: function(sender, indexPath) {
            showActions(indexPath.row)
          }
        }
      }
    ]
  })
}