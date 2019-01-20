let helper = require("scripts/helper");
let text = helper.getText();
let result = text.charAt(0).toUpperCase() + text.slice(1);
helper.setText(result);