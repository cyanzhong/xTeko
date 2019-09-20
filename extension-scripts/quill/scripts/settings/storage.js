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

exports.imageQuality = () => {
  const value = $cache.get("image-quality");
  if (value == undefined) {
    return 2;
  } else {
    return value;
  }
}

exports.setImageQuality = quality => {
  $cache.set("image-quality", quality);
}