$define_struct({
  name: "UIEdgeInsets",
  props: [
    { name: "top", type: "CGFloat" },
    { name: "left", type: "CGFloat" },
    { name: "bottom", type: "CGFloat" },
    { name: "right", type: "CGFloat" },
  ]
});

exports.imageNamed = name => {
  return $objc("UIImage").$imageNamed(name).rawValue();
}

exports.loadImage = path => {
  let file = $file.read(path);
  let scale = $device.info.screen.scale;
  return $objc("UIImage").$imageWithData_scale(file, scale).rawValue();
}

exports.imageWithInsets = (image, insets) => {
  return image.runtimeValue().$resizableImageWithCapInsets_resizingMode(insets, 1).rawValue();
}

exports.loadIcon = code => {
  return $icon(code, require("./colors").black, $size(18, 18));
}

exports.loadPlugin = plugin => {
  if (plugin.script) {
    return plugin.script;
  } else {
    let file = $file.read(`plugins/${plugin.file}`);
    return file ? file.string : null;
  }
}

exports.showTapAnimation = view => {
  $ui.animate({
    duration: 0.3,
    animation: () => {
      view.bgcolor = $rgba(200, 200, 200, 0.1);
    },
    completion: () => {
      $ui.animate({
        duration: 0.3,
        animation: () => {
          view.bgcolor = $color("white");
        }
      });
    }
  });
}