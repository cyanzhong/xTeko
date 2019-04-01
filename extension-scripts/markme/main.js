const setup = require("./scripts/setup");
setup.example();

const explorer = require("./scripts/explorer");
explorer.open();

const updater = require("./scripts/updater");
updater.check();