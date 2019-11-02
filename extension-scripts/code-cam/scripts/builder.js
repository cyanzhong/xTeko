exports.navigationItem = (name, target, action) => {
  const image = $objc("UIImage").$systemImageNamed(name);
  const item = $objc("UIBarButtonItem").$alloc().$initWithImage_style_target_action(image, 0, target, action);
  return item;
}

exports.colorWithAlpha = (hex, alpha) => {
  const color = $color(hex).ocValue();
  return color.$colorWithAlphaComponent(alpha).jsValue();
}