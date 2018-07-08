function color(hex) {
  return $color(hex).runtimeValue();
}

function rect(rect, radius, color) {
  var node = $objc("SKShapeNode").$shapeNodeWithRect_cornerRadius({ x: 0, y: 0, width: rect.width, height: rect.height }, radius);
  node.$setStrokeColor(color);
  node.$setFillColor(color);
  node.$setPosition({ x: rect.x, y: rect.y });
  return node;
}

function gesture(target, action, direction) {
  var recognizer = $objc("UISwipeGestureRecognizer").$alloc().$initWithTarget_action(target, action);
  recognizer.$setDirection(direction);
  return recognizer;
}

function audioNode(name) {
  var container = $objc("NSFileManager").$defaultManager().$containerURLForSecurityApplicationGroupIdentifier("group.jsbox.share").$path();
  var folder = "/JSBox/Code/" + $addin.current.name + "/assets/" + name;
  var path = container.$stringByAppendingPathComponent(folder);
  var url = NSURL.$fileURLWithPath(path);
  var node = $objc("SKAudioNode").$alloc().$initWithURL(url);
  node.$setAutoplayLooped(false);
  return node;
}

function labelNode(text, fontSize, fontColor, fontName) {
  var node = $objc("SKLabelNode").$labelNodeWithFontNamed(fontName || "Helvetica-Bold");
  node.$setVerticalAlignmentMode(1);
  node.$setHorizontalAlignmentMode(0);
  node.$setFontSize(fontSize);
  if (fontColor) {
    node.$setFontColor(fontColor);
  }
  node.$setText(text);
  return node;
}

module.exports = {
  color: color,
  rect: rect,
  gesture: gesture,
  audioNode: audioNode,
  labelNode: labelNode,
}