var center = $objc("UNUserNotificationCenter").invoke("currentNotificationCenter");
center.invoke("getPendingNotificationRequestsWithCompletionHandler", $block("void, NSArray *", function(requests) {
  var identifiers = $objc("NSMutableArray").invoke("alloc.init");
  var length = requests.invoke("count");
  for (var idx=0; idx<length; ++idx) {
    var identifier = requests.invoke("objectAtIndex", idx).invoke("identifier");
    identifiers.invoke("addObject", identifier);
  }
  center.invoke("removePendingNotificationRequestsWithIdentifiers", identifiers);
  center.invoke("removeAllDeliveredNotifications")
}));