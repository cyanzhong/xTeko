function color(hex) {
  return $color(hex).runtimeValue();
}

function rect(rect, radius, color) {
  var node = $objc("SKShapeNode").invoke("shapeNodeWithRect:cornerRadius:", { x: 0, y: 0, width: rect.width, height: rect.height }, radius);
  node.invoke("setStrokeColor", color);
  node.invoke("setFillColor", color);
  node.invoke("setPosition", { x: rect.x, y: rect.y });
  return node;
}

function gesture(target, action, direction) {
  var recognizer = $objc("UISwipeGestureRecognizer").invoke("alloc.initWithTarget:action:", target, action);
  recognizer.invoke("setDirection", direction);
  return recognizer;
}

function audioNode(name) {
  var container = $objc("NSFileManager").invoke("defaultManager.containerURLForSecurityApplicationGroupIdentifier", "group.jsbox.share").invoke("path");
  var folder = "/JSBox/Code/" + $addin.current.name + "/assets/" + name;
  var path = container.invoke("stringByAppendingPathComponent", folder);
  var url = $objc("NSURL").invoke("fileURLWithPath", path);
  var node = $objc("SKAudioNode").invoke("alloc.initWithURL", url);
  node.invoke("setAutoplayLooped", false);
  return node;
}

function labelNode(text, fontSize, fontColor, fontName) {
  var node = $objc("SKLabelNode").invoke("labelNodeWithFontNamed", fontName || "Helvetica-Bold");
  node.invoke("setVerticalAlignmentMode", 1);
  node.invoke("setHorizontalAlignmentMode", 0);
  node.invoke("setFontSize", fontSize);
  if (fontColor) {
    node.invoke("setFontColor", fontColor);
  }
  node.invoke("setText", text);
  return node;
}

module.exports = {
  color: color,
  rect: rect,
  gesture: gesture,
  audioNode: audioNode,
  labelNode: labelNode,
}