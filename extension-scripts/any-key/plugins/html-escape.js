let helper = require("scripts/helper");
let text = helper.getText();
let escaped = $text.HTMLEscape(text);
helper.setText(escaped);