function load(path) {
  $objc("NSBundle").$bundleWithPath(path).$load();
}

module.exports = {
  load: load
}