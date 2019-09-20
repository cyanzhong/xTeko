const constants = require("./constants");

exports.setup = () => {
  if (!$file.exists(constants.sitesFolder)) {
    $file.mkdir(constants.sitesFolder);
  }
}

const isZip = file => {
  return file.split(".").pop().toLowerCase() === "zip";
}

exports.isZip = isZip;

exports.removePathExtension = path => {
  if (isZip(path)) {
    return path.split(".").slice(0, -1).join(".");
  } else {
    return path;
  }
}

exports.toZipFile = name => {
  if (isZip(name)) {
    return name;
  } else {
    return `${name}.zip`;
  }
}

exports.loadImage = name => {
  let file = $file.read(`assets/${name}.png`);
  return $objc("UIImage").$imageWithData_scale(file, 3).jsValue();
}

exports.successTaptic = () => {
  $objc("UINotificationFeedbackGenerator").$new().$notificationOccurred(0);
}