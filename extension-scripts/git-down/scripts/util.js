const folderPath = "assets/.tmp";
exports.folderPath = folderPath;

exports.makeFolder = () => {
  $file.delete(folderPath);
  $file.mkdir(folderPath);
}

exports.removeLastPathComponent = path => {
  const components = path.split("/");
  components.pop();
  return components.join("/");
}

exports.successTaptic = () => {
  $thread.main({
    handler: () => {
      $objc("UINotificationFeedbackGenerator").$new().$notificationOccurred(0);
    }
  });
}