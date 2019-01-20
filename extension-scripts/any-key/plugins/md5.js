let helper = require("scripts/helper");
let text = helper.getText();
let md5 = $text.MD5(text);
helper.setText(md5);