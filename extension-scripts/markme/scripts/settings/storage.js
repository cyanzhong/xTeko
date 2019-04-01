exports.theme = () => {
  return $cache.get("theme") || "arduino-light";
}

exports.setTheme = theme => {
  $cache.set("theme", theme);
}

exports.font = () => {
  return $cache.get("font") || "Menlo";
}

exports.setFont = font => {
  $cache.set("font", font);
}

exports.fontSize = () => {
  return $cache.get("font-size") || 17;
}

exports.setFontSize = size => {
  $cache.set("font-size", size);
}

exports.linePadding = () => {
  return $cache.get("line-padding") || 2;
}

exports.setLinePadding = linePadding => {
  $cache.set("line-padding", linePadding);
}

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