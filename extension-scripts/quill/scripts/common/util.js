const storage = require("../settings/storage");

exports.buildNumber = () => {
  return $app.info.build;
}

const isQuillFile = name => {
  return name.toLowerCase().endsWith(".quill");
}

exports.isQuillFile = isQuillFile;

exports.toQuillFile = name => {
  if (isQuillFile(name)) {
    return name;
  } else {
    return `${name}.quill`;
  }
}

exports.listFolder = folder => {
  const contents = $file.list(folder);
  if (contents == null || contents.length == 0) {
    return [];
  }

  const files = contents.map(name => {
    return {
      name: name,
      isDirectory: $file.isDirectory(exports.filePath(folder, name))
    }
  }).filter(file => {
    if (file.isDirectory) {
      return true;
    } else if (isQuillFile(file.name)) {
      return true;
    } else {
      return false;
    }
  }).sort((lhs, rhs) => {
    if (lhs.isDirectory != rhs.isDirectory) {
      return lhs.isDirectory ? -1 : 1;
    } else {
      return lhs.name > rhs.name;
    }
  });

  return files;
}

exports.filePath = (folder, name) => {
  if (folder === "") {
    return name;
  } else if (folder.endsWith("/")) {
    return `${folder}${name}`;
  } else {
    return [folder, name].join("/");
  }
}

exports.fileExtension = path => {
  return path.toLowerCase().split(".").pop();
}

exports.removePathExtension = path => {
  if (path.includes(".")) {
    return path.split(".").slice(0, -1).join(".");
  } else {
    return path;
  }
}

const lastPathComponent = path => {
  return path.split("/").pop();
}

exports.lastPathComponent = lastPathComponent;

exports.newFile = path => {
  $file.write({
    data: $objc("NSData").$new().jsValue(),
    path: path
  });
}

exports.stringToData = string => {
  return string.$dataUsingEncoding(4).jsValue();
}

exports.shareFolder = async(folder) => {
  const name = lastPathComponent(folder);
  const dest = "assets/archiver.zip";
  const success = await $archiver.zip({
    directory: folder,
    dest: dest
  });

  if (success) {
    const file = $file.read(dest);
    $share.sheet([`${name}.zip`, file]);
  }
}

exports.loadImage = name => {
  let file = $file.read(`assets/${name}.png`);
  return $objc("UIImage").$imageWithData_scale(file, 3).jsValue();
}

exports.imageWithInsets = (image, insets) => {
  return image.ocValue().$resizableImageWithCapInsets_resizingMode(insets, 1).jsValue();
}

exports.compressImage = image => {
  const screen = $device.info.screen;
  const scale = screen.scale;
  const width = Math.min(image.size.width, screen.width);
  const height = Math.ceil(image.size.height * width / image.size.width);

  const size = $size(width * scale, height * scale);
  const resized = image.resized(size);
  const small = (image.size.width < screen.width * scale);

  if (small) {
    return {
      "data": resized.png,
      "type": "png"
    };
  } else {
    const quality = [0.3, 0.5, 0.7][storage.imageQuality()];
    return {
      "data": resized.jpg(quality),
      "type": "jpeg"
    }
  }
}

exports.wrapHTML = body => {
  const readFile = (name, prefix="assets/editor/") => {
    return $file.read(`${prefix}${name}`).string;
  }

  let styleSheet = "";
  const fonts = require("../define/constants").fontNames;
  fonts.forEach(font => {
    const name = font.replace(/ /g, "");
    styleSheet += `.ql-font-${name} {\n  font-family: "${font}"\n}\n\n`;
  });

  let html = readFile("template.html");
  html = html.replace("{{highlight}}", `<style>${readFile("highlight.css")}</style>`);
  html = html.replace("{{katex}}", `<style>${readFile("katex.css")}</style>`);
  html = html.replace("{{quill}}", `<style>${readFile("quill.css")}</style>`);
  html = html.replace("{{theme}}", `<style>${readFile("theme.css")}</style>`);
  html = html.replace("{{fonts}}", `<style>${styleSheet}</style>`);
  html = html.replace("{{style}}", `<style>${readFile("style.css", "")}</style>`);
  html = html.replace("{{body}}", `<body>${body}</body>`);
  return html;
}

exports.enableBackGesture = enabled => {
  let controller = $ui.controller;
  if (!controller) {
    return;
  }

  let controllerOC = controller.ocValue();
  if (!controllerOC) {
    return;
  }

  let navigationVC = controllerOC.$navigationController();
  let recognizer = navigationVC.$interactivePopGestureRecognizer();
  if (recognizer) {
    recognizer.$setEnabled(enabled);
  }
}

exports.successTaptic = () => {
  $objc("UINotificationFeedbackGenerator").$new().$notificationOccurred(0);
}

exports.showTextField = (title, message, readyHandler, doneHandler) => {
  const alert = $objc("UIAlertController").$alertControllerWithTitle_message_preferredStyle(title, null, 1);

  const addTextField = handler => {
    alert.$addTextFieldWithConfigurationHandler($block("void, UITextField *", textField => {
      handler(textField);
    }));
  }

  const addAction = (title, handler) => {
    const action = $objc("UIAlertAction").$actionWithTitle_style_handler(title, 0, $block("void, UIAlertAction *", action => {
      if (handler) {
        handler();
      }
    }));
    alert.$addAction(action);
  }

  addTextField(textField => {
    textField.$setPlaceholder(message);
    if (readyHandler) {
      readyHandler(textField);
    }
  });

  addAction($l10n("CANCEL"), null);

  addAction($l10n("OK"), () => {
    const textFields = alert.$textFields();
    const text = textFields.$firstObject().$text().jsValue();
    if (!text || text.length == 0) {
      alert.$show();
      return;
    }

    if (doneHandler) {
      doneHandler(text);
    }
  });

  alert.$show();
}