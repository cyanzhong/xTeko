exports.loadNotes = () => {
  return $cache.get("notes") || [];
}

exports.saveNotes = notes => {
  $cache.set("notes", notes);
}