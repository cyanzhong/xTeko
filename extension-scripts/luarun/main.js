const explorer = require("./scripts/explorer");
explorer.open();

const server = require("./scripts/server");
server.init();

const updater = require("./scripts/updater");
updater.check();

const overrides = require("./scripts/overrides");
$app.listen({
  ready: () => overrides.inject(),
  exit: () => overrides.cancel(),
});