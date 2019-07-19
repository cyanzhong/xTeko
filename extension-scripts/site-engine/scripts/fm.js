const constants = require("./constants");
const storage = require("./storage");
const util = require("./util");

exports.unzip = (site, handler) => {
  const sourcePath = `${constants.sitesFolder}/${site}`;
  const file = $file.read(sourcePath); 
  const dest = `${constants.sitesFolder}/${util.removePathExtension(site)}`;

  $archiver.unzip({
    file: file,
    dest: dest,
    handler: success => {
      const contents = $file.list(dest);
      const subFolder = `${dest}/${contents[0]}`;
      const tmpFolder = `${dest}/__temp__`;
      if (contents.length === 1 && $file.isDirectory(subFolder)) {
        $file.move({
          src: subFolder,
          dst: tmpFolder
        });

        const files = $file.list(tmpFolder);
        files.forEach(name => {
          const src = `${tmpFolder}/${name}`;
          const dst = `${dest}/${name}`;

          $file.move({
            src: src,
            dst: dst
          });
        });

        $file.delete(tmpFolder);
      }

      $file.delete(sourcePath);
      if (handler) {
        handler();
      }
    }
  });
}

exports.startServer = async(reloadData) => {
  const result = await $http.startServer({
    port: 6868,
    path: constants.sitesFolder
  });

  if (result.success) {
    const timer = $timer.schedule({
      interval: 2,
      handler: reloadData
    });

    $ui.alert({
      title: $l10n("SERVER_STARTED"),
      message: result.url,
      actions: [
        {
          title: $l10n("CLOSE"),
          handler: async() => {
            await $http.stopServer();
            reloadData();
            timer.invalidate();
          }
        }
      ]
    });
  } else {
    $ui.alert({
      title: $l10n("FAILED"),
      message: $l10n("PLEASE_RESTART")
    });
  }
}

exports.openFiles = async(reloadData) => {
  const file = await $drive.open();
  const name = file.fileName;
  $file.write({
    data: file,
    path: `${constants.sitesFolder}/${name}`
  });

  reloadData();
}

exports.findIndexPage = name => {
  const folder = `${constants.sitesFolder}/${name}`;
  const pages = [storage.indexPage(), "index.html", "index.htm"];
  for (const page of pages) {
    if ($file.exists(`${folder}/${page}`)) {
      return page;
    }
  }

  const contents = $file.list(folder);
  for (const file of contents) {
    const lowercased = file.toLowerCase();
    if (lowercased.endsWith(".html") || lowercased.endsWith(".htm")) {
      return file;
    }
  }

  return null;
}