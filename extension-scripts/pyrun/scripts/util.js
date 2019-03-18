exports.isPyFile = name => {
  return name.toLowerCase().endsWith(".py");
}

exports.filePath = (folder, name) => {
  if (folder.endsWith("/")) {
    return `${folder}${name}`;
  } else {
    return [folder, name].join("/");
  }
}

exports.newFile = path => {
  $file.write({
    data: $objc("NSData").$new().rawValue(),
    path: path
  });
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
  }).filter(file => {
    if (file.isDirectory) {
      return true;
    } else if (file.name.toLowerCase().endsWith(".py")) {
      return true;
    } else {
      return false;
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

exports.setSwipeBackEnabled = enabled => {
  let navigationVC = $ui.controller.runtimeValue().$navigationController();
  let recognizer = navigationVC.$interactivePopGestureRecognizer();
  recognizer.$setEnabled(enabled);
}