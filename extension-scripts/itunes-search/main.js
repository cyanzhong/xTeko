$include("scripts/define")

if ($app.env != $env.app) {
  $app.openURL("jsbox://run?name=" + encodeURI($addin.current.name));
  return;
}

var app = require('scripts/app');
app.render();