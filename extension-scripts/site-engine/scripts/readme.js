exports.open = () => {
  $ui.push({
    props: {
      title: "README"
    },
    views: [
      {
        type: "markdown",
        props: {
          content: $file.read($l10n("README_FILE")).string
        },
        layout: $layout.fill
      }
    ]
  });
}