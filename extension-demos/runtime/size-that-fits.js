function sizeThatFits(text, width, font, lineBreak, lineSpacing) {

  if (text == null || width == 0 || font == null) {
    return $size(0, 0);
  }

  var style = $objc("NSMutableParagraphStyle").invoke("new");
  style.invoke("setLineBreakMode", lineBreak || 0);
  
  if (lineSpacing) {
    style.invoke("setLineSpacing", lineSpacing);
  }

  var size = {width: width, height: 10000};
  var options = (1 << 0) | (1 << 1);

  var attributes = $objc("NSMutableDictionary").invoke("new");
  attributes.invoke("setObject:forKey:", style, "NSParagraphStyle");
  attributes.invoke("setObject:forKey:", font.runtimeValue(), "NSFont");

  var string = $objc("NSString").invoke("stringWithString", text);
  var rect = string.invoke("boundingRectWithSize:options:attributes:context:", size, options, attributes, null);
  return $size(rect.width, rect.height);
}

var size = sizeThatFits("Hello, World. Hello, World. Hello, World. Hello, World. Hello, World", 320, $font(20));
console.log(size);