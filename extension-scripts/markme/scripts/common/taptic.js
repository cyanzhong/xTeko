exports.success = () => {
  $objc("UINotificationFeedbackGenerator").$new().$notificationOccurred(0);
}