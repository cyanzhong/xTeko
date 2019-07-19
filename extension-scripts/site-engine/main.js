const util = require("./scripts/util");
util.setup();

const explorer = require("./scripts/explorer");
explorer.open();

const updater = require("./scripts/updater");
updater.check();