const server = require("./scripts/server");

const keyman = require("./scripts/keyman");
keyman.observe();

const ui = require("./scripts/ui");
server.init(() => ui.init());

const updater = require("./scripts/updater");
updater.check();