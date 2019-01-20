let helper = require("scripts/helper");
let text = await helper.getText();
let url = `https://www.google.com/maps/place/${encodeURIComponent(text)}`;
$app.openURL(url);