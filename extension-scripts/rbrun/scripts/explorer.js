const util = require("./util");
const colors = require("./colors");
const templates = require("./templates");

exports.open = open;

function open(path="files", root=true) {
  const folder = path;

  const views = {
    props: {
      title: "RbRun",
      navButtons: [
        {
          image: util.loadImage("nav-add"),
          handler: () => {
            addButtonTapped(folder)
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          bgcolor: colors.darkGray,
          separatorColor: colors.lightGray,
          template: templates.explorerList,
          actions: [
            {
              title: "DELETE",
              handler: (sender, indexPath) => {
                const files = util.listFolder(folder);
                const name = files[indexPath.row].name;
                const path = util.filePath(folder, name);
                $file.delete(path);
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          ready: () => {
            reloadFolder(folder)
          },
          didSelect: async(sender, indexPath) => {
            const files = util.listFolder(folder);
            const file = files[indexPath.row];
            if (file.isDirectory) {
              openFolder(`${folder}/${file.name}`);
            } else {
              openFile(util.filePath(folder, file.name));
            }
          }
        }
      }
    ]
  };

  if (root) {
    $ui.render(views);
  } else {
    $ui.push(views);
  }
}

function reloadFolder(folder) {
  const files = util.listFolder(folder);
  $("list").data = files.map(file => {
    return {
      "icon": {
        "src": `assets/${file.isDirectory ? "folder" : "ruby"}.png`
      },
      "label": {
        "text": file.name
      }
    }
  });
}

function openFolder(path) {
  open(path, false);
}

function openFile(path) {
  const editor = require("./editor");
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

async function newFolder(folder) {
  const text = await $input.text({
    type: $kbType.ascii,
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
    type: $kbType.ascii,
    placeholder: $l10n("FILE_NAME")
  });

  if (!util.isRubyFile(text)) {
    text = `${text}.rb`;
  }

  const files = util.listFolder(folder);
  if (files.includes(text)) {
    $ui.error($l10n("INVALID_NAME"));
  } else {
    util.newFile(util.filePath(folder, text));
  }

  reloadFolder(folder);
}

async function importFile(folder) {
  const file = await $drive.open();
  const name = file.fileName;

  if (!util.isRubyFile(name)) {
    return;
  }

  $file.write({
    data: file,
    path: util.filePath(folder, name)
  });

  reloadFolder(folder);
}
