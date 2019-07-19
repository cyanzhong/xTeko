const util = require("./scripts/util");
util.setup();

const explorer = require("./scripts/explorer");
explorer.open();

$addin.checkUpdate();