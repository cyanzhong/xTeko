const constants = require("./common/constants");

$define_struct({
  name: "UIEdgeInsets",
  props: [
    {name: "top", type: "CGFloat"},
    {name: "left", type: "CGFloat"},
    {name: "bottom", type: "CGFloat"},
    {name: "right", type: "CGFloat"},
  ]
});

exports.example = () => {
  const key = "example-initialized";

  if (!$file.exists(constants.cloudFolder)) {
    $file.mkdir(constants.cloudFolder);
  }

  if (!$file.exists("files")) {
    $file.mkdir("files");
  }

  if (!$file.exists("images")) {
    $file.mkdir("images");
  }

  if (!($cache.get(key) || false)) {
    $cache.set(key, true);

    const name = $l10n("EXAMPLE_FILE");
    $file.copy({
      src: name,
      dst: `files/${name}`
    });
  }
}