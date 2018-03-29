function open_app(appid) {
  $objc("LSApplicationWorkspace").invoke("defaultWorkspace").invoke("openApplicationWithBundleID", appid)
}

function array_move(array, oldIndex, newIndex) {
  if (newIndex >= array.length) {
    var k = newIndex - array.length + 1
    while (k--) {
      array.push(undefined)
    }
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0])
}

function array_remove(array, index) {
  array.splice(index, 1)
}

module.exports = {
  open_app: open_app,
  array_move: array_move,
  array_remove: array_remove
}