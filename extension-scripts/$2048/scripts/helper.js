function playAudio(node) {
  node.$runAction(SKAction.$stop());
  node.$runAction(SKAction.$play());
}

function sendAction(action, target) {
  var app = $objc("UIApplication").$sharedApplication();
  app.$sendAction_to_from_forEvent(action, target, null, null);
}

function pointInRect(point, rect) {
  return point.x >= rect.x && point.x <= (rect.x + rect.width) &&
         point.y >= rect.y && point.y <= rect.y + rect.height;
}

module.exports = {
  playAudio: playAudio,
  sendAction: sendAction,
  pointInRect: pointInRect,
}