let helper = require("scripts/helper");
let text = helper.getText();
let decoded = $text.base64Decode(text);
helper.setText(decoded);