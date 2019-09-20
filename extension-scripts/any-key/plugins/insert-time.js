const helper = require("scripts/helper");

let date = await $picker.date({
  props: {
    mode: 0
  }
});

helper.setText(date.toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit"
}));