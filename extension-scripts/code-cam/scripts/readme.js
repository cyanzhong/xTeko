exports.open = () => {
  $ui.push({
    props: {
      title: $l10n("ABOUT")
    },
    views: [
      {
        type: "markdown",
        props: {
          content: (() => {
            const name = $l10n("README_FILE");
            const file = $file.read(name);
            return file.string;
          })()
        },
        layout: $layout.fill
      }
    ]
  });
}