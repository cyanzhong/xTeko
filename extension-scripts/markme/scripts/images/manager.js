const util = require("./util");
let files = [];

exports.open = selectHandler => {
  $ui.push({
    props: {
      title: $l10n("LOCAL_IMAGES"),
      navButtons: [
        {
          title: $l10n("ADD"),
          handler: addImage
        },
        {
          title: $l10n("CLEAR"),
          handler: clearImages
        }
      ]
    },
    views: [
      {
        type: "matrix",
        props: {
          id: "images",
          square: true,
          columns: 2,
          spacing: 10,
          template: [
            {
              type: "image",
              props: {
                id: "image"
              },
              layout: $layout.fill
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            didSelectItem(indexPath, selectHandler);
          }
        }
      }
    ]
  });

  reloadFiles();
}

async function clearImages() {
  const options = [$l10n("CLEAR")];
  const {index} = await $ui.menu(options);
  if (index == 0) {
    util.clearImages();
    reloadFiles();
    const taptic = require("../common/taptic");
    taptic.success();
  }
}

async function addImage() {
  util.openImagePicker({
    selectedPath: reloadFiles
  });
}

function reloadFiles() {
  files = $file.list("images").filter(filename => {
    return !$file.isDirectory(`images/${filename}`);
  });

  $("images").data = files.map(fileToImage);
}

function fileToImage(filename) {
  return {
    "image": {
      "src": `images/thumb/${filename}`
    }
  };
}

async function didSelectItem(indexPath, selectHandler) {
  const path = files[indexPath.item];
  if (selectHandler) {
    selectHandler(path);
    $ui.pop();
    return;
  }

  const options = [$l10n("DELETE")];
  const {index} = await $ui.menu(options);
  
  if (index == 0) {
    util.deleteImage(path);
    files.splice(indexPath.item, 1);
    $("images").delete(indexPath);
  }
}