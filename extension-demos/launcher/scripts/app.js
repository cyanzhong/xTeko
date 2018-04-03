var cache = require("scripts/cache")
var helper = require("scripts/helper")
var actions = cache.getActions()

function init() {
  if ($app.env == $env.today) {
    var widget = require("scripts/widget")
    widget.init()
  } else {
    render()
  }
}

function render() {
  $ui.render({
    views: [
      {
        type: "button",
        props: {
          id: "create-button",
          title: $l10n("CREATE_ACTION")
        },
        layout: function(make, view) {
          make.left.bottom.right.inset(10)
          make.height.equalTo(44)
        },
        events: { tapped: showMenu }
      },
      {
        type: "list",
        props: {
          id: "action-list",
          reorder: true,
          template: require("scripts/template").list,
          data: actions.map(function(item) { return toListItem(item) }),
          rowHeight: 72,
          actions: [
            {
              title: "delete",
              handler: function(sender, indexPath) {
                helper.array_remove(actions, indexPath.row)
                cache.setActions(actions)
              }
            }
          ]
        },
        layout: function(make, view) {
          make.left.top.right.equalTo(0)
          make.bottom.equalTo($("create-button").top).offset(-10)
        },
        events: {
          didSelect: function(sender, indexPath) {
            $ui.menu({
              items: [$l10n("RENAME"), $l10n("OPEN")],
              handler: function(title, idx) {
                if (idx == 0) {
                  renameItem(indexPath.row)
                } else if (idx == 1) {
                  helper.open_app(actions[indexPath.row].id)
                }
              }
            })
          },
          reorderMoved: function(fromIndexPath, toIndexPath) {
            helper.array_move(actions, fromIndexPath.row, toIndexPath.row)
          },
          reorderFinished: function() {
            cache.setActions(actions)
          }
        }
      }
    ]
  })
}

function showMenu() {
  $ui.menu({
    items: [$l10n("SEARCH_IN_STORE"), $l10n("CREATE_MANUALLY")],
    handler: function(title, idx) {
      if (idx == 0) {
        var search = require("scripts/search")
        search.init(function(data) {
          createAction(data)
        })
      } else if (idx == 1) {

      }
    }
  })
}

function createAction(data) {
  $http.download({
    url: data.icon,
    handler: function(resp) {

      var path = "app-icons/" + data.id + ".png"
      $file.mkdir("app-icons")
      $file.write({ data: resp.data, path: path })

      var item = { icon: path, name: data.name, id: data.id }
      actions.unshift(item)
      cache.setActions(actions)

      $("action-list").insert({ value: toListItem(item), index: 0 })
    }
  })
}

function renameItem(index) {
  $input.text({
    text: actions[index].name,
    handler: function(text) {
      actions[index].name = text
      cache.setActions(actions)
      $("action-list").data = actions.map(function(item) { return toListItem(item) })
    }
  })
}

module.exports = {
  init: init
}

// Helpers

function toListItem(item) {
  return {
    "app-icon-image": { "src": item.icon },
    "app-name-label": { text: item.name },
    "bundle-id-label": { text: item.id }
  }
}