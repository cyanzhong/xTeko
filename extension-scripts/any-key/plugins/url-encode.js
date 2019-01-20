let helper = require("scripts/helper");
let text = helper.getText();
let encoded = $text.URLEncode(text);
helper.setText(encoded);