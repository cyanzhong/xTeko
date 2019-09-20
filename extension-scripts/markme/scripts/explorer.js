const constants = require("./common/constants");
const util = require("./common/util");
const colors = require("./common/colors");
const template = require("./templates/explorer");
const headers = require("./templates/headers");

let _openedFolder = null;
$app.listen({
  resume: () => {
    reloadFolder(_openedFolder, true);
  }
});

function open(path=constants.localFolder, root=true, title) {
  _openedFolder = path;
  const folder = path;

  const views = {
    props: {
      title: title || (root ? constants.appName : util.lastPathComponent(path)),
      navButtons: [
        {
          image: util.loadImage("setting"),
          handler: settingButtonTapped
        },
        {
          image: util.loadImage("add"),
          handler: () => {
            addButtonTapped(folder);
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: `explorer/${folder}`,
          bgcolor: colors.white,
          template: template,
          header: root ? headers.cloudFolder(() => {
            openFolder(constants.cloudFolder, $l10n("ICLOUD_DRIVE"));
          }) : headers.dummy(),
          actions: [
            {
              title: "DELETE",
              handler: (sender, indexPath) => {
                const files = util.listFolder(folder);
                const name = files[indexPath.row].name;
                const path = util.filePath(folder, name);
                $file.delete(path);
              }
            },
            {
              title: $l10n("RENAME"),
              handler: async(sender, indexPath) => {
                const files = util.listFolder(folder);
                const file = files[indexPath.row];

                let src = file.name;
                let dst = await $input.text({
                  text: src
                });

                if (!file.isDirectory) {
                  dst = util.toMarkdownFile(dst);
                }

                $file.move({
                  src: util.filePath(folder, src),
                  dst: util.filePath(folder, dst)
                });

                reloadFolder(folder);
              }
            },
            {
              title: $l10n("SHARE"),
              handler: (sender, indexPath) => {
                const files = util.listFolder(folder);
                const file = files[indexPath.row];
                if (file.isDirectory) {
                  shareFolder(util.filePath(folder, file.name));
                } else {
                  shareFile(folder, file);
                }
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: async(sender, indexPath) => {
            const files = util.listFolder(folder);
            const file = files[indexPath.row];
            const path = util.filePath(folder, file.name);
            if (file.isDirectory) {
              openFolder(path, file.displayName);
            } else {
              openFile(path);
            }
          }
        }
      }
    ],
    events: {
      appeared: () => {
        reloadFolder(folder);
      }
    }
  };

  if (root) {
    $ui.render(views);
  } else {
    $ui.push(views);
  }

  reloadFolder(folder);
}

exports.open = open;

let lastTime = 0;
function reloadFolder(folder, throttle=false) {
  const now = new Date().getTime();
  if (throttle && (now - lastTime < 1000)) {
    return;
  }

  const files = util.listFolder(folder);
  const list = $(`explorer/${folder}`);

  if (list) {
    list.data = files.map(file => {
      let image = file.isDirectory ? "folder" : "markdown";
      return {
        "icon": {
          "src": `assets/${image}.png`
        },
        "label": {
          "text": file.displayName || file.name
        }
      }
    });
  }

  lastTime = now;
}

function openFolder(path, title) {
  open(path, false, title);
}

function openFile(path) {
  const editor = require("./editor/editor");
  editor.open(path);
}

async function addButtonTapped(folder) {
  const options = [
    $l10n("NEW_FOLDER"),
    $l10n("NEW_FILE"),
    $l10n("IMPORT_FILE"),
  ];

  const INDEX = {
    NEW_FOLDER: 0,
    NEW_FILE: 1,
    IMPORT_FILE: 2,
  }

  const {index} = await $ui.menu(options);
  switch (index) {
    case INDEX.NEW_FOLDER:
      newFolder(folder);
      break;
    case INDEX.NEW_FILE:
      newFile(folder);
      break;
    case INDEX.IMPORT_FILE:
      importFile(folder);
      break;
  }
}

function settingButtonTapped() {
  const settings = require("./settings/root");
  settings.open();
}

async function newFolder(folder) {
  const text = await $input.text({
    placeholder: $l10n("FOLDER_NAME")
  });

  if ($file.mkdir(util.filePath(folder, text))) {
    reloadFolder(folder);
  } else {
    $ui.error($l10n("INVALID_NAME"));
  }
}

async function newFile(folder) {
  let text = await $input.text({
    placeholder: $l10n("FILE_NAME")
  });

  text = util.toMarkdownFile(text);
  const files = util.listFolder(folder);

  if (files.includes(text)) {
    $ui.error($l10n("INVALID_NAME"));
  } else {
    util.newFile(util.filePath(folder, text));
  }

  reloadFolder(folder);
  $delay(0.5, () => {
    openFile(util.filePath(folder, text));
  });
}

async function importFile(folder) {
  const file = await $drive.open();
  const name = file.fileName;
  saveFile(file, name, folder);
  reloadFolder(folder);
}

async function shareFolder(folder) {
  util.shareFolder(folder);
}

function shareFile(folder, file) {
  const path = util.filePath(folder, file.name);
  const data = $file.read(path);
  $share.sheet([file.name, data]);
}

function saveFile(data, name, folder) {
  $file.write({
    data: data,
    path: util.filePath(folder, name)
  });

  reloadFolder(folder);
}