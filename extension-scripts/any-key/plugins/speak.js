let helper = require("scripts/helper");
let selectedText = helper.getText();
let {index} = await $ui.menu(["TTS", "How to Pronounce"]);
if (index === 0) {
  $text.speech({"text": selectedText});
} else {
  $ui.toast($l10n("LOADING"));
  let text = selectedText.split(" ").filter(item => { return item.length > 0 }).join("-");
  let {data} = await $http.get(`https://www.howtopronounce.com/${encodeURIComponent(text)}`);
  const regex = /data-id="(.*mp3?)"/g;
  let match = regex.exec(data);
  if (match != null) {
    $audio.play({"url": match[1]});
  }
}