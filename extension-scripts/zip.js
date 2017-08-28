var files = $context.dataItems
var dest = "Archive.zip"

if (files.length == 0) {
  return
}

$archiver.zip({
  files: files,
  dest: dest,
  handler: function(success) {
    if (success) {
      $share.sheet([dest, $file.read(dest)])
    }
  }
})