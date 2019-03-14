exports.isDebugMode = () => {
  return $objc("BBEngine").$shared().$debug();
}

exports.removeExtension = path => {
  return path.split(".").slice(0, -1).join(".");
}

exports.isValidFolder = folder => {
  if (folder == null || folder.length == 0 || folder.length > 8) {
    return false;
  } else {
    return /^[0-9a-zA-Z]*$/.test(folder);
  }
}

exports.setSwipeBackEnabled = enabled => {
  let navigationVC = $ui.controller.runtimeValue().$navigationController();
  let recognizer = navigationVC.$interactivePopGestureRecognizer();
  recognizer.$setEnabled(enabled);
}

exports.setAudioEnabled = enabled => {
  let canvas = $("canvas");
  if (canvas) {
    canvas.eval({"script": `setAudioEnabled(${enabled})`});
  }
}

exports.destroyDosBox = () => {
  let canvas = $("canvas");
  if (canvas) {
    canvas.html = "<html></html>";
    canvas.remove();
  }
}