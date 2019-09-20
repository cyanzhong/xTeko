let helper = require("scripts/helper");
let text = await helper.getAllText();
let length = text.length;
$ui.toast(`${length} ${$l10n("CHARACTERS")}`);