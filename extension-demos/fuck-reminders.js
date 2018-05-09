var store = $objc("EKEventStore").invoke("alloc.init");
var handler = $block("void, BOOL, NSError *", function(granted, error) {
  var predicate = store.invoke("predicateForRemindersInCalendars", null);
  store.invoke("fetchRemindersMatchingPredicate:completion:", predicate, $block("void, NSArray *", function(reminders) {
    var count = reminders.invoke("count");
    for (var idx=0; idx<count; ++idx) {
      var reminder = reminders.invoke("objectAtIndex", idx);
      store.invoke("removeReminder:commit:error:", reminder, true, null);
    }
    console.log("Done!");
  }))
});
console.log("Cleaning...");
store.invoke("requestAccessToEntityType:completion:", 1, handler);