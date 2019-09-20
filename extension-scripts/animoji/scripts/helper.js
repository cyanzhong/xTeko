var util = require("./util");

function loadPuppets(path) {
  var names = util.ios13 ? $objc("AVTAnimoji").$animojiNames() : $objc("AVTPuppet").$puppetNames();
  var puppets = [];

  for (var idx=0; idx<names.$count(); ++idx) {
    puppets.push(names.$objectAtIndex(idx).rawValue());
  }

  return puppets;
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
  loadPuppets: loadPuppets,
  deleteFile: deleteFile,
  formatTime: formatTime,
}