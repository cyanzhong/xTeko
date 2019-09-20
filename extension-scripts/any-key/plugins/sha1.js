let helper = require("scripts/helper");
let text = helper.getText();
let sha1 = $text.SHA1(text);
helper.setText(sha1);