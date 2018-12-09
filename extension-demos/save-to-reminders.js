let text = await $input.text({placeholder: "Add to Reminders.app"});
let store = $objc("EKEventStore").$new();
let entityType = 1;

let completion = $block("void, BOOL, NSError *", (granted, error) => {

  $thread.main({

    handler: async() => {

      if (!granted) {
        $ui.error("Unable to fetch calendars.");
        return;
      }
    
      let calendars = store.$calendarsForEntityType(entityType);
      let titles = [];
    
      for (var idx=0; idx<calendars.$count(); ++idx) {
        let title = calendars.$objectAtIndex(idx).$title().rawValue();
        titles.push(title);
      }
    
      let {index} = await $ui.menu(titles);
      let calendar = calendars.$objectAtIndex(index);
      let reminder = $objc("EKReminder").$reminderWithEventStore(store);

      reminder.$setTitle(text);
      reminder.$setCalendar(calendar);
      store.$saveReminder_commit_error(reminder, true, null);

      $ui.toast("Reminder has been saved successfully.");
    }
  });
});

store.$requestAccessToEntityType_completion(entityType, completion);