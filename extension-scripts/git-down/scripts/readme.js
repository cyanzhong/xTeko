exports.open = () => {
  $ui.render({
    props: {
      title: $l10n("README")
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