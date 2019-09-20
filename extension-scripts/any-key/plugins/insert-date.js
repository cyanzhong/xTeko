const helper = require("scripts/helper");

let date = await $picker.date({
  props: {
    mode: 1
  }
});

helper.setText(date.toLocaleDateString([], {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
}));