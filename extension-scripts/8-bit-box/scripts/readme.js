exports.show = () => {
  $ui.push({
    props: {
      title: $l10n("ABOUT")
    },
    views: [
      {
        type: "markdown",
        props: {
          content: (() => {
            let filename = $l10n("README_FILE");
            return $file.read(filename).string;
          })()
        },
        layout: $layout.fill
      }
    ]
  });
}