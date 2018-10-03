let scanner = require("./scripts/scanner");

try {
  let images = await scanner.scanDocument();
  $share.sheet(images);
} catch (error) {
  alert(error);
}