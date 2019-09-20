exports.show = () => {
  $ui.push({
    props: {
      title: "AnyKey"
    },
    views: [
      {
        type: "markdown",
        props: {
          content: (() => {
            let filename = $l10n("README_FILE_NAME");
            return $file.read(filename).string;
          })()
        },
        layout: $layout.fill
      }
    ]
  });
}