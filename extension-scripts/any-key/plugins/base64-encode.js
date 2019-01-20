let helper = require("scripts/helper");
let text = helper.getText();
let encoded = $text.base64Encode(text);
helper.setText(encoded);