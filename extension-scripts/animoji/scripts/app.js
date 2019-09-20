function init() {

  // Load framework
  var loader = require("./framework-loader");
  loader.open("/System/Library/PrivateFrameworks/AvatarKit.framework");
  
  // Render
  var ui = require("./ui");
  ui.render();
}

module.exports = {
  init: init
}