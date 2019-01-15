exports.imageNamed = name => {
  return $objc("UIImage").$imageNamed(name).rawValue();
}

exports.makeThumbnail = image => {
  return image.resized($size(500, 500));
}

exports.loadImage = note => {
  return $file.read(`images/${note.image}`).image;
}

exports.loadThumnail = note => {
  return $file.read(`images/thumbnails/${note.image}`).image;
}

exports.makeHash = () => {
  let uuid = $objc("NSUUID").$UUID().$UUIDString();
  return uuid.rawValue();
}

exports.makeFolder = path => {
  $file.mkdir(path);
}