const util = require("./util");
const colors = require("./colors");
const templates = require("./templates");

exports.open = open;

function open(path="www/files", root=true) {
  const folder = path;

  const views = {
    props: {
      title: "nbviewer",
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
          bgcolor: colors.white,
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
    let image = "file";
    let extension = util.fileExtension(file.name);
    if (file.isDirectory) {
      image = "folder";
    } else if (extension == "ipynb") {
      image = "jupyter";
    } else if (extension == "png" || extension == "jpg" || extension == "jpeg") {
      image = "image";
    }

    return {
      "icon": {
        "src": `assets/${image}.png`
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
  let extension = util.fileExtension(path);
  if (extension == "ipynb") {
    const renderer = require("./renderer");
    renderer.load(path);
  } else {
    const data = $file.read(path);
    if (data) {
      $quicklook.open({"data": data});
    }
  }
}

async function addButtonTapped(folder) {
  const options = [
    $l10n("NEW_FOLDER"),
    $l10n("IMPORT_FILE"),
    $l10n("SCAN_QRCODE"),
  ];

  const INDEX = {
    NEW_FOLDER: 0,
    IMPORT_FILE: 1,
    SCAN_QRCODE: 2,
  }

  const {index} = await $ui.menu(options);
  switch (index) {
    case INDEX.NEW_FOLDER:
      newFolder(folder);
      break;
    case INDEX.IMPORT_FILE:
      importFile(folder);
      break;
    case INDEX.SCAN_QRCODE:
      scanQRCode(folder);
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

async function importFile(folder) {
  const file = await $drive.open();
  const name = file.fileName;
  saveFile(file, name, folder);
}

async function scanQRCode(folder) {
  const qrcode = await $qrcode.scan();
  if (qrcode) {
    const {data, response} = await $http.get(qrcode);
    const file = $data({"string": JSON.stringify(data)});
    const name = response.suggestedFilename;
    saveFile(file, name, folder);
  }
}

function saveFile(data, name, folder) {
  $file.write({
    data: data,
    path: util.filePath(folder, name)
  });

  reloadFolder(folder);
}