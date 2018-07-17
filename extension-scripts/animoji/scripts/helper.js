function loadJSON(path) {
  return JSON.parse($file.read(path).string);
}

function deleteFile(url) {
  var manager = $objc("NSFileManager").$defaultManager();
  manager.$removeItemAtURL_error(url, null);
}

function formatTime(duration) {

  var minutes = Math.floor(duration / 60);
  var seconds = duration % 60;

  function format(number) {
    number = parseInt(number);
    return number < 10 ? `0${number}` : `${number}`;
  }

  return `${format(minutes)}:${format(seconds)}`;
}

module.exports = {
  loadJSON: loadJSON,
  deleteFile: deleteFile,
  formatTime: formatTime,
}