var scheme = "inbox://";
var files = $file.list(scheme)

$app.strings = {
  "en": {
    "IMPORT_DELETE": "Import & Delete",
    "DELETE_DIRECTLY": "Delete Directly"
  },
  "zh-Hans": {
    "IMPORT_DELETE": "导入后删除",
    "DELETE_DIRECTLY": "直接删除"
  }
}

$ui.render({
  props: {title: "Inbox"},
  views: [{
    type: "list",
    props: {data: files},
    layout: $layout.fill,
    events: {
      didSelect: function(sender, indexPath) {
        var name = files[indexPath.row]
        var path = scheme + name
        function _delete() {
          $file.delete(path)
          sender.delete(indexPath)
        }
        $ui.menu({
          items: [$l10n("IMPORT_DELETE"), $l10n("DELETE_DIRECTLY")],
          handler: function(title, idx) {
            if (idx == 0) {
              $addin.save({name: name, data: $file.read(path)})
              _delete()
            } else if (idx == 1) {
              _delete()
            }
          }
        })
      }
    }
  }]
})