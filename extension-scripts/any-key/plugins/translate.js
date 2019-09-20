let helper = require("scripts/helper");
let text = await helper.getAllText();
let url = `https://translate.google.com/#view=home&op=translate&sl=auto&tl=zh-CN&text=${encodeURIComponent(text)}`;
helper.openURL(url);