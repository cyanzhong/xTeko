let majorVersion = parseInt($device.info.version.split(".")[0]);
if (majorVersion < 11) {
  alert($l10n("UPGRADE_IOS"));
} else {
  let app = require("./scripts/app");
  app.render();
}

let updater = require("./scripts/updater");
updater.check();