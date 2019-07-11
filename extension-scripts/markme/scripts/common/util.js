const isMarkdown = name => {
  const lowercased = name.toLowerCase();
  return lowercased.endsWith(".md") || lowercased.endsWith(".markdown");
}

exports.isMarkdown = isMarkdown;

exports.toMarkdownFile = name => {
  if (isMarkdown(name)) {
    return name;
  } else {
    return `${name}.md`;
  }
}

exports.toHTML = (text, withStyle) => {
  const regex = new RegExp(`(!\\[.*\\]\\()(.+)(\.png|\.jpg)`, "g");
  const markdown = text.replace(regex, ($0, $1, $2, $3) => {
    if ($2.indexOf("http") === 0) {
      return $0;
    } else {
      const file = $file.read(`images/${$2}${$3}`);
      const base64 = $text.base64Encode(file);
      return `${$1}data:image/${$3};base64,${base64}`;
    }
  });

  const content = $text.markdownToHtml(markdown);
  if (withStyle) {
    const renderer = $file.read("assets/template.html");
    let html = renderer.string;
    html = html.replace("{{content}}", content);
    html = html.replace("{{style}}", (() => {
      const file = $file.read("assets/style.css");
      return file ? `<style>${file.string}</style>` : "";
    })());
    return html;
  } else {
    return content;
  }
}

exports.buildNumber = () => {
  const bundle = $objc("NSBundle").$mainBundle();
  const version = bundle.$objectForInfoDictionaryKey("CFBundleVersion");
  return parseInt(version.rawValue());
}

exports.listFolder = folder => {
  const files = $file.list(folder).map(name => {
    return {
      name: name,
      isDirectory: $file.isDirectory(exports.filePath(folder, name))
    }
  }).filter(file => {
    if (file.isDirectory) {
      return true;
    } else if (isMarkdown(file.name)) {
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
  return path.split(".").slice(0, -1).join(".");
}

const lastPathComponent = path => {
  return path.split("/").pop();
}

exports.lastPathComponent = lastPathComponent;

exports.newFile = path => {
  $file.write({
    data: $objc("NSData").$new().rawValue(),
    path: path
  });
}

exports.stringToData = string => {
  return string.$dataUsingEncoding(4).rawValue();
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
  return $objc("UIImage").$imageWithData_scale(file, 3).rawValue();
}

exports.imageWithInsets = (image, insets) => {
  return image.runtimeValue().$resizableImageWithCapInsets_resizingMode(insets, 1).rawValue();
}

exports.enableBackGesture = enabled => {
  let navigationVC = $ui.controller.runtimeValue().$navigationController();
  let recognizer = navigationVC.$interactivePopGestureRecognizer();
  if (recognizer) {
    recognizer.$setEnabled(enabled);
  }
}