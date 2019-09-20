const constants = require("./constants");
const util = require("./util");
const storage = require("./storage");
const server = require("./server");
const fm = require("./fm");

let sites = [];
exports.open = () => {
  $ui.render({
    props: {
      title: "",
      navButtons: [
        {
          image: util.loadImage("setting"),
          handler: settingButtonTapped
        },
        {
          image: util.loadImage("add"),
          handler: addButtonTapped
        },
        {
          image: util.loadImage("info"),
          handler: infoButtonTapped
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "site-list",
          template: [
            {
              type: "image",
              props: {
                id: "icon",
                contentMode: $contentMode.scaleAspectFit
              },
              layout: (make, view) => {
                make.left.equalTo(15);
                make.size.equalTo($size(20, 20));
                make.centerY.equalTo(view.super);
              }
            },
            {
              type: "label",
              props: {
                id: "label"
              },
              layout: (make, view) => {
                make.left.equalTo(50);
                make.right.inset(15);
                make.centerY.equalTo(view.super);
              }
            }
          ],
          actions: [
            {
              title: "DELETE",
              handler: handleDelete
            },
            {
              title: $l10n("RENAME"),
              handler: handleRename
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            const site = sites[indexPath.row];
            launch(site);
          }
        }
      }
    ]
  });

  reloadData();
}

function launch(site) {
  const open = path => {
    server.setSiteName(path);
    const indexPage = fm.findIndexPage(path);

    if (indexPage) {
      const url = `http://${constants.host}:${storage.port()}/${encodeURIComponent(path)}/${indexPage}`;
      if (storage.browserIndex() === 0) {
        $safari.open({
          url: url,
        });
      } else {
        const webView = require("./web-view");
        webView.open(site, url);
      }
    } else {
      $ui.alert({
        title: $l10n("FAILED"),
        message: $l10n("INDEX_NOT_FOUND")
      });
    }
  }

  if (util.isZip(site)) {
    fm.unzip(site, () => {
      reloadData();
      open(util.removePathExtension(site));
    });
  } else {
    open(site);
  }
}

function reloadData() {
  sites = $file.list(constants.sitesFolder).filter(file => {
    const path = `${constants.sitesFolder}/${file}`;
    if ($file.isDirectory(path)) {
      return true;
    } else if (util.isZip(file)) {
      return true;
    } else {
      return false;
    }
  }).sort();

  $("site-list").data = sites.map(site => {
    return {
      "icon": {
        "src": "assets/site.png"
      },
      "label": {
        "text": util.removePathExtension(site)
      }
    }
  });
}

function settingButtonTapped() {
  const settings = require("./settings");
  settings.open();
}

async function addButtonTapped() {
  const items = [$l10n("WEB_SERVER"), $l10n("ICLOUD_DRIVE")];
  const {index} = await $ui.menu(items);
  if (index === 0) {
    fm.startServer(reloadData);
  } else {
    fm.openFiles(reloadData);
  }
}

function infoButtonTapped() {
  const readme = require("./readme");
  readme.open();
}

function handleDelete(sender, indexPath) {
  const name = sites[indexPath.row];
  $file.delete(`${constants.sitesFolder}/${name}`);
}

async function handleRename(sender, indexPath) {
  let src = sites[indexPath.row];
  let dst = await $input.text({
    text: util.removePathExtension(src)
  });

  if (dst == null || dst.length == 0) {
    return;
  }

  if (util.isZip(src)) {
    dst = util.toZipFile(dst);
  }

  $file.move({
    src: `${constants.sitesFolder}/${src}`,
    dst: `${constants.sitesFolder}/${dst}`
  });

  reloadData();
}