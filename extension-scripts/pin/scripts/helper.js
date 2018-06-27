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

  var hasPlaceholder = pattern.indexOf("%@") != -1;
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
    var extension = $objc("NSExtension").invoke("extensionWithIdentifier:error:", identifier, null);
    var composer = $objc("SLComposeViewController").invoke("composeViewControllerForExtension", extension);
    
    var text = $clipboard.text;
    if (text) {
      composer.invoke("setInitialText", text);
    }

    var image = $clipboard.image;
    if (image) {
      composer.invoke("addImage", image);
    }

    var link = $clipboard.link;
    if (link) {
      var url = $objc("NSURL").invoke("URLWithString", link);
      composer.invoke("addURL", url);
    }

    var fromVC = $ui.vc.runtimeValue();
    fromVC.invoke("presentViewController:animated:completion:", composer, true, null);

    return;
  }

  if (hasPlaceholder && _hasPrefix(pattern, "tel:")) {
    $app.openURL("tel:" + $clipboard.phoneNumber || "");
    return;
  }

  if (hasPlaceholder && _hasPrefix(pattern, "sms:")) {
    $app.openURL("sms:" + $clipboard.phoneNumber || "");
    return;
  }

  if (hasPlaceholder && _hasPrefix(pattern, "facetime:")) {
    $app.openURL("facetime:" + $clipboard.phoneNumber || "");
    return;
  }

  if (hasPlaceholder && _hasPrefix(pattern, "mailto:")) {
    $app.openURL("mailto:" + $clipboard.email || "");
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

function makeIcon(iconName, color) {

  var length = 180;
  var canvas = $ui.create({ type: "view" });
  canvas.bgcolor = color;
  canvas.frame = $rect(0, 0, length, length);

  canvas.add({
    type: "view",
    props: {
      bgcolor: $color("white"),
      radius: 72,
      frame: $rect(18, 18, 144, 144)
    }
  });

  canvas.add({
    type: "image",
    props: {
      icon: $icon(iconName, color, 72),
      bgcolor: $color("clear"),
      frame: $rect(54, 54, 72, 72)
    }
  })

  return canvas.snapshot;
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
  makeIcon: makeIcon,
}