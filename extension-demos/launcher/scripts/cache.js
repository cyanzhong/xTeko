const Keys = {
  Actions: "Actions"
}

function getActions() {
  return $cache.get(Keys.Actions) || []
}

function setActions(actions) {
  $cache.set(Keys.Actions, actions)
}

module.exports = {
  getActions: getActions,
  setActions: setActions
}