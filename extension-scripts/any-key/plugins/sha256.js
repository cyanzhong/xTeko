let helper = require("scripts/helper");
let text = helper.getText();
let sha256 = $text.SHA256(text);
helper.setText(sha256);