$app.strings = {
  "en": {
    "WRONG_ENV": "Please use this script from main app or action extension",
    "WRONG_FILE_TYPE": " is not a shortcut file",
  },
  "zh-Hans": {
    "WRONG_ENV": "请在主应用或分享面板使用这个脚本",
    "WRONG_FILE_TYPE": " 不是 shortcut 文件！",
  }
};

var serverPort = 8989;
var localFileName = "shortcuts-installer.shortcut";
var installURL = `shortcuts://import-workflow?url=http://localhost:${serverPort}/download?path=%2f${localFileName}&name=`;

function install(data) {

  if (!data || !data.fileName) {
    return;
  }

  var fileName = data.fileName;
  if (fileName.indexOf(".shortcut") === -1) {
    $ui.error(fileName + $l10n("WRONG_FILE_TYPE"));
    closeDelayed(2);
  } else {
    $file.delete(localFileName);
    if ($file.write({ data: data, path: localFileName })) {
      $http.startServer({ port: serverPort }).then(() => {
        var shortcutName = fileName.split(".").slice(0, -1).join(".");
        $app.openURL(installURL + encodeURIComponent(shortcutName));
      });
    }
  }
}

function closeDelayed(delay) {
  $thread.main({
    delay: delay,
    handler: () => {
      $context.close();
      $app.close();
    }
  });
}

switch ($app.env) {
  case $env.app: install(await $drive.open()); break;
  case $env.action: install($context.data); break;
  default: {
    $ui.error($l10n("WRONG_ENV"));
    closeDelayed(2);
    break;
  }
}