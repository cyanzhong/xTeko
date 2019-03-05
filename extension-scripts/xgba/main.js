require("./scripts/responder");

const explorer = require("./scripts/explorer");
explorer.open();

const server = require("./scripts/server");
server.init();

const updater = require("./scripts/updater");
updater.check();