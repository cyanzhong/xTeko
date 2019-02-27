exports.removeExtension = path => {
  return path.split(".").slice(0, -1).join(".");
}

exports.hash = path => {
  return $text.MD5(path);
}