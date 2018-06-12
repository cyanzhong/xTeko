var dataManager = require("scripts/data-manager");
dataManager.init();

var path = $app.env == $env.today ? "scripts/widget" : "scripts/app";
var module = require(path);
module.init();