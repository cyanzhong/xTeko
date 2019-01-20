exports.getText = () => {
  if ($app.env === $env.keyboard) {
    let selectedText = $keyboard.selectedText;
    if (selectedText && selectedText.length > 0) {
      return selectedText;
    }
  }
  return $clipboard.text || "";
}

exports.getAllText = async() => {

  let selectedText = $keyboard.selectedText;
  let allText = await $keyboard.getAllText();
  let clipboardText = $clipboard.text || "";

  return new Promise((resolve, reject) => {
    if (selectedText && selectedText.length) {
      resolve(selectedText);
    } else if (allText && allText.length) {
      resolve(allText);
    } else {
      resolve(clipboardText);
    }
  });
}

exports.setText = text => {
  if ($app.env === $env.keyboard) {
    $keyboard.insert(text);
  } else {
    $clipboard.text = text;
    $quicklook.open({"text": text});
  }
}