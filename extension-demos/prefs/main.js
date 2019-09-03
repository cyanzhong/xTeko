$ui.render({
  props: {
    title: "",
    navButtons: [
      {
        title: "Settings",
        handler: () => {
          $prefs.open();
        }
      }
    ]
  }
});