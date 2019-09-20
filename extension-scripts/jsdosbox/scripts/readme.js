exports.open = () => {
  $ui.push({
    props: {
      title: $l10n("README")
    },
    views: [
      {
        type: "markdown",
        props: {
          content: (() => {
            let filename = $l10n("README_FILE");
            let file = $file.read(filename);
            return file.string;
          })()
        },
        layout: $layout.fill
      }
    ]
  });   
}