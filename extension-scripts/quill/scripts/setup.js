const constants = require("./define/constants");

$define_struct({
  name: "UIEdgeInsets",
  props: [
    {name: "top", type: "CGFloat"},
    {name: "left", type: "CGFloat"},
    {name: "bottom", type: "CGFloat"},
    {name: "right", type: "CGFloat"},
  ]
});

exports.init = () => {
  const key = "files-initialized";

  if (!$file.exists(constants.localFolder)) {
    $file.mkdir(constants.localFolder);
  }

  if (!$file.exists(constants.cloudFolder)) {
    $file.mkdir(constants.cloudFolder);
  }

  if (!($cache.get(key) || false)) {
    $cache.set(key, true);
    
    $file.copy({
      src: "assets/example.quill",
      dst: `files/${$l10n("EXAMPLE_FILE")}.quill`
    });
  }

  if (!$file.exists(constants.themePath)) {
    $file.copy({
      src: "assets/theme.css",
      dst: constants.themePath
    });
  }

  if (!$file.exists("style.css")) {
    $file.copy({
      src: "assets/style.css",
      dst: "style.css"
    });
  }
}