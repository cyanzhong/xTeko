function arrayMove(array, oldIndex, newIndex) {
  if (newIndex >= array.length) {
    var k = newIndex - array.length + 1;
    while (k--) {
      array.push(undefined);
    }
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
}

function arrayRemove(array, index) {
  array.splice(index, 1);
}

function searchText(text) {
  var engine = require("./data-manager").getSearchEngine();
  openURL(engine + encodeURIComponent(text));
}

function openURL(pattern) {

  pattern = pattern.replace("%@", encodeURIComponent($clipboard.text || ""));

  if (_hasPrefix(pattern, "open-url:")) {
    $app.openURL($clipboard.link);
    return;
  }

  if (_hasPrefix(pattern, "share-sheet://")) {
    var text = $clipboard.text;
    var image = $clipboard.image;
    if (text) {
      $share.sheet(text);
    } else if (image) {
      $share.sheet(image);
    }
    return;
  }

  if (_hasPrefix(pattern, "compose://")) {
    var identifier = pattern.substring("compose://?id=".length);
    var extension = $objc("NSExtension").invoke("extensionWithIdentifier:error:", identifier, null)
    var composer = $objc("SLComposeViewController").invoke("composeViewControllerForExtension", extension)
    var fromVC = $ui.vc.runtimeValue();
    fromVC.invoke("presentViewController:animated:completion:", composer, true, null)
    return;
  }

  if (_hasPrefix(pattern, "tel:")) {
    $app.openURL("tel:" + $clipboard.phoneNumber);
    return;
  }

  if (_hasPrefix(pattern, "sms:")) {
    $app.openURL("sms:" + $clipboard.phoneNumber);
    return;
  }

  if (_hasPrefix(pattern, "facetime:")) {
    $app.openURL("facetime:" + $clipboard.phoneNumber);
    return;
  }

  if (_hasPrefix(pattern, "mailto:")) {
    $app.openURL("mailto:" + $clipboard.email);
    return;
  }

  $app.openURL(pattern);
}

function blinkView(view) {
  $ui.animate({
    duration: 0.3,
    animation: function() {
      view.bgcolor = $rgba(200, 200, 200, 0.25);
    },
    completion: function() {
      $ui.animate({
        duration: 0.3,
        animation: function() {
          view.bgcolor = $color("white");
        }
      });
    }
  });
}

function _hasPrefix(string, prefix) {
  return string.lastIndexOf(prefix, 0) === 0;
}

module.exports = {
  arrayMove: arrayMove,
  arrayRemove: arrayRemove,
  searchText: searchText,
  openURL: openURL,
  blinkView: blinkView,
}