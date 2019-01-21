if ($app.env == $env.keyboard) {
  $define({
    type: "UINavigationController",
    events: {
      popViewControllerAnimated: animated => {
        self.$ORIGpopViewControllerAnimated(animated);
        if (self.$viewControllers().$count() == 1) {
          setHeight(normalHeight);
        }
      }
    }
  });
}

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

exports.openURL = async(url) => {
  await expand();
  $ui.push({
    props: {
      title: url
    },
    views: [
      {
        type: "web",
        props: {
          url: url
        },
        layout: $layout.fill
      }
    ]
  });
}

var normalHeight = 0;
exports.expand = expand;

async function expand() {
  return new Promise((resolve, reject) => {
    if ($app.env != $env.keyboard) {
      resolve();
    } else {
      let vc = $ui.controller.runtimeValue();
      let frame = vc.$view().$frame();
      normalHeight = frame.height;
      setHeight(frame.width);
      $delay(0.1, resolve);
    }
  });
}

function setHeight(height) {

  if ($app.env != $env.keyboard || normalHeight == 0) {
    return;
  }

  let vc = $ui.controller.runtimeValue();
  if (!vc.$heightConstraint()) {
    let constraint = $objc("NSLayoutConstraint").$constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(vc.$view(), 8, 0, null, 0, 1, height);
    vc.$view().$addConstraint(constraint);
    vc.$setHeightConstraint(constraint);
  } else {
    vc.$heightConstraint().$setConstant(height);
  }
}