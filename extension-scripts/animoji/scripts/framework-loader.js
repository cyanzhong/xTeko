function open(path) {
  var bundle = $objc("NSBundle").$bundleWithPath(path);
  if (bundle) {
    bundle.$load();
  }
}

module.exports = {
  open: open
}