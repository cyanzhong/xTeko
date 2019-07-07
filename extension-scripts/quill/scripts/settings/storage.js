exports.autoSave = () => {
  const value = $cache.get("auto-save");
  if (value == undefined) {
    return true;
  } else {
    return value;
  }
}

exports.setAutoSave = value => {
  $cache.set("auto-save", value);
}