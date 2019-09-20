const server = require("./scripts/server");
server.init();

const explorer = require("./scripts/explorer");
explorer.open();

const updater = require("./scripts/updater");
updater.check();