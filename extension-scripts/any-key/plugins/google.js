let helper = require("scripts/helper");
let text = await helper.getAllText();
let url = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
helper.openURL(url);