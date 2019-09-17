const util = require("./util");
util.makeFolder();

const context = {};

async function run() {
  // Reset
  context.tasks = new Set(),
  context.basePath = "";

  // Extensions
  if ($app.env != $env.app) {
    const name = $addin.current.name;
    const uri = (() => {
      if ($app.env == $env.safari) {
        return $context.safari.items.baseURI;
      } else {
        return "";
      }
    })();
    const url = `jsbox://run?name=${encodeURIComponent(name)}&uri=${encodeURIComponent(uri)}`;
    $app.openURL(url);
    return;
  }

  // Safari -> app
  const queryURI = $context.query.uri;
  if (queryURI && queryURI.length > 0) {
    handle(queryURI);
    return;
  }

  // Run in app
  const option = await $ui.menu([
    $l10n("SCAN_QRCODE"),
    $l10n("INPUT_URL"),
    $l10n("README"),
  ]);

  if (option === undefined) {
    return;
  }

  if (option.index === 0) {
    const qrcode = await $qrcode.scan();
    if (qrcode) {
      handle($detector.link(qrcode)[0]);
    }
  } else if (option.index === 1) {
    const text = await $input.text({
      type: $kbType.url,
      text: $clipboard.link || ""
    });
    if (text) {
      handle($detector.link(text)[0]);
    }
  } else if (option.index === 2) {
    const readme = require("./readme");
    readme.open();
  }

  async function handle(url) {
    if (url == null || url.length == 0) {
      $ui.error($l10n("INVALID_URL"));
      return;
    }

    if (url.slice(-"/".length) === "/") {
      url = url.slice(0, -1);
    }

    // Example: https://github.com/cyanzhong/xTeko/tree/master/extension-demos/keyboard
    const regex = /(http|https):\/\/github.com\/(.+)\/(tree|blob)\/(.+?)\/(.+)/;
    const matches = regex.exec(url);
    if (matches) {
      const repo = matches[2];
      const branch = matches[4];
      const path = matches[5];
      $ui.loading(true);
      fetchNode(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, true);
    } else {
      // Example: https://github.com/cyanzhong/xTeko
      if (/(http|https):\/\/github.com\/(.+)\/([^/]+)/.test(url)) {
        // Try master branch,
        // if the default branch isn't master, it will fail
        const repo = url.split("/").slice(0, 5).join("/");
        downloadMaster(`${repo}/archive/master.zip`);
      }
    }
  }
}

function fetchNode(url, isRoot) {
  context.tasks.add(url);
  console.log(`Fetching: ${url}`);

  $http.get(url).then(resp => {
    context.tasks.delete(url);
    const nodes = resp.data;

    // Direct download
    if (isRoot && !Array.isArray(nodes) && (typeof nodes === "object")) {
      directDownload(nodes.download_url);
      return;
    }

    nodes.forEach(node => {
      const type = node.type;
      if (type === "file") {
        // Find basePath
        if (isRoot) {
          context.basePath = util.removeLastPathComponent(node.path);
        }
        // Download file
        downloadFile(node.path.replace(context.basePath || "", ""), node.download_url);
      } else if (type === "dir") {
        // Fetch recursively
        fetchNode(node._links.self, false);
      } else {
        // Error
      }
    });

    notifyWhenFinish();
  });
}

async function downloadMaster(url) {
  const repo = url.split("/")[4];
  $ui.loading(true);
  const {data} = await $http.download({
    url: url,
    showsProgress: false
  });
  $ui.loading(false);
  handleFile(data, repo);
}

async function downloadFile(path, url) {
  context.tasks.add(url);
  console.log(`Downloading: ${url}`);

  $http.download({
    url: url,
    showsProgress: false
  }).then(resp => {
    context.tasks.delete(url);

    const filePath = `${util.folderPath}${path}`;
    const folderPath = util.removeLastPathComponent(filePath);
    if (!$file.exists(folderPath) || !$file.isDirectory(folderPath)) {
      $file.mkdir(folderPath);
    }

    $file.write({
      data: resp.data,
      path: filePath
    });

    notifyWhenFinish();
  });
}

async function directDownload(url) {
  const {data} = await $http.download({
    url: url,
    showsProgress: false
  });
  handleFile(data, data.fileName);
}

async function handleFile(data, name) {
  const option = await $ui.menu([$l10n("INSTALL_SCRIPT"), $l10n("SAVE_TO_FILES")]);
  if (option == null) {
    return;
  } else if (option.index == 0) {
    $addin.save({
      name: name,
      data: data
    });
    util.successTaptic();
  } else {
    await $drive.save({
      name: `${name}.zip`,
      data: data
    });
    util.successTaptic();
  }
}

async function notifyWhenFinish() {
  if (context.tasks.size == 0) {
    console.log("All Done.");
    $ui.loading(false);

    const path = "assets/data.zip";
    $file.delete(path);

    const success = await $archiver.zip({
      directory: util.folderPath,
      dest: path
    });

    if (success) {
      const name = context.basePath.split("/").pop();
      const data = $file.read(path);
      handleFile(data, name);
      $file.delete(path);
    } else {
      // Error
    }
  } else {
    // In progress
  }
}

exports.run = run;