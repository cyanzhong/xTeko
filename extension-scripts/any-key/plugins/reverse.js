let helper = require("scripts/helper");
let text = helper.getText();
let reversed = reverse(text);
helper.setText(reversed);

function reverse(str) {
  let result = "";
  str.split("").forEach(char => result = char + result);
  return result;
}