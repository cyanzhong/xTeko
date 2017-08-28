var file = $context.data
if (file) {
  $archiver.unzip({
    file: file,
    dest: "",
    handler: function(result) {
      $ui.toast(result)
    }
  })
}