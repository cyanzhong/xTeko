if ($device.isIphoneX) {
  var app = require("./scripts/app");
  app.init();
} else {
  $ui.alert($l10n("IPHONEX_ONLY"));
}