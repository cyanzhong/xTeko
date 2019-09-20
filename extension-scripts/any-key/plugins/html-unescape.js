let helper = require("scripts/helper");
let text = helper.getText();
let unescaped = $text.HTMLUnescape(text);
helper.setText(unescaped);