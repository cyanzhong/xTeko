exports.ios13 = parseInt($device.info.version.split(".")[0]) >= 13;

exports.successTaptic = () => {
  $thread.main({
    handler: () => {
      $objc("UINotificationFeedbackGenerator").$new().$notificationOccurred(0);
    }
  });
}