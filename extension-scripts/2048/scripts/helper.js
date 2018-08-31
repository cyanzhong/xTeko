function playAudio(node) {
  node.invoke("runAction", $objc("SKAction").invoke("stop"));
  node.invoke("runAction", $objc("SKAction").invoke("play"));
}

function sendAction(action, target) {
  var app = $objc("UIApplication").invoke("sharedApplication");
  app.invoke("sendAction:to:from:forEvent:", action, target, null, null);
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