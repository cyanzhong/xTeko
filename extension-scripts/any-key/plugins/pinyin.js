let helper = require("scripts/helper");
let text = helper.getText();
let pinyin = $text.convertToPinYin(text);
helper.setText(pinyin);