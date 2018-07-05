function load(path) {
  $objc("NSBundle").invoke("bundleWithPath", path).invoke("load");
}

module.exports = {
  load: load
}