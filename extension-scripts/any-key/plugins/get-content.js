let helper = require("scripts/helper");
let text = helper.getText();

let items = [
  $l10n("GET_PHONE_NUMBER"),
  $l10n("GET_LINK"),
  $l10n("GET_DATE"),
];

let handlers = [
  () => helper.setText($detector.phoneNumber(text)[0] || ""),
  () => helper.setText($detector.link(text)[0] || ""),
  () => helper.setText($detector.date(text)[0] || ""),
];

let {index} = await $ui.menu(items);
handlers[index]();