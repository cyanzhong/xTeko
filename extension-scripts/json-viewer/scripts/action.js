var helper = require("./helper");

function init() {
  var text = ($context.safari ? $context.safari.items.source : null) || $context.text || ($context.data ? $context.data.string : null) || $clipboard.text || "";
  var json = helper.parseJson(text || "{}");
  if (json) {
    helper.renderJson(json);
  }
}

module.exports = {
  init: init
}