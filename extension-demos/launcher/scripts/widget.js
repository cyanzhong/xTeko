var cache = require("scripts/cache")
var helper = require("scripts/helper")
var actions = cache.getActions()

function init() {
  $ui.render({
    views: [
      {
        type: "matrix",
        props: {
          columns: 5,
          itemHeight: 50,
          spacing: 25,
          selectable: false,
          template: {
            views: [
              {
                type: "image",
                props: {
                  id: "icon-image",
                  radius: 12
                },
                layout: $layout.fill
              }
            ]
          },
          data: actions.map(function(item) {
            return {
              "icon-image": {
                src: item.icon
              }
            }
          })
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath) {
            helper.open_app(actions[indexPath.item].id)
          }
        }
      }
    ]
  })
}

module.exports = {
  init: init
}