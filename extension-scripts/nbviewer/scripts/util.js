exports.filePath = (folder, name) => {
  if (folder.endsWith("/")) {
    return `${folder}${name}`;
  } else {
    return [folder, name].join("/");
  }
}

exports.loadImage = name => {
  const scale = parseInt($device.info.screen.scale);
  const file = $file.read(`assets/${name}@${scale}x.png`).runtimeValue();
  const image = $objc("UIImage").$imageWithData_scale(file, scale);
  return image.rawValue();
}

exports.listFolder = folder => {
  const files = $file.list(folder).map(name => {
    return {
      name: name,
      isDirectory: $file.isDirectory(exports.filePath(folder, name))
    }
  }).sort((lhs, rhs) => {
    if (lhs.isDirectory != rhs.isDirectory) {
      return lhs.isDirectory ? -1 : 1;
    } else {
      return lhs.name > rhs.name;
    }
  });

  return files;
}

exports.fileExtension = path => {
  return path.toLowerCase().split(".").pop();
}