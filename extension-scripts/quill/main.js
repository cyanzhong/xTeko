const setup = require("./scripts/setup");
setup.init();

const explorer = require("./scripts/explorer");
explorer.open();

const keyman = require("./scripts/common/keyman");
keyman.observe();

const updater = require("./scripts/updater");
updater.check();

const overrides = require("./scripts/define/overrides");
$app.listen({
  ready: () => overrides.register(),
  exit: () => overrides.unregister(),
});