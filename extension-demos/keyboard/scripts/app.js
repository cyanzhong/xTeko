function init() {
  if ($app.env == $env.keyboard) {
    require("scripts/keyboard").render()
  } else {
    require("scripts/main").render()
  }
}

module.exports = {
  init: init
}