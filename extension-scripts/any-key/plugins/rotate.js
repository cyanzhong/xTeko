let helper = require("scripts/helper");
let text = helper.getText();
let lines = text.split("\n");
var maxLen = 0;

for (const line of lines) {
  if (line.length > maxLen) {
    maxLen = line.length;
  }
}

let arrays = [];
for (var i=0; i<maxLen; ++i) {
  let array = [];
  for (var j=0; j<lines.length; ++j) {
    array.push("  ");
  }
  arrays.push(array);
}

for (var y=0; y<lines.length; ++y) {
  let line = lines[y];
  let tokens = line.split("");
  for (var x=0; x<maxLen; ++x) {
    arrays[x][y] = tokens[x] || "  ";
  }
}

let results = [];
for (const array of arrays) {
  results.push(array.join(""));
}

let output = results.join("\n");
helper.setText(output);