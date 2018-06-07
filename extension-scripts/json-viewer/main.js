if ($app.env == $env.action) {
  var action = require('scripts/action');
  action.init();
} else {
  var app = require('scripts/app');
  app.init();
}