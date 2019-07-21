const util = require("./util");
const templates = require("./templates");
let collections = null;
let selectedIndexes = null;

exports.open = () => {
  selectedIndexes = [];

  $app.listen({
    resume: reloadData
  });

  $ui.push({
    props: {
      title: $l10n("ORGANIZE_ALBUMS"),
      navButtons: [
        {
          title: $l10n("DELETE"),
          handler: deleteAlbums
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "album-list",
          template: templates.explorerList
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            const index = indexPath.row;
            const searchIndex = selectedIndexes.indexOf(index);
            if (searchIndex !== -1) {
              selectedIndexes.splice(searchIndex, 1);
            } else {
              selectedIndexes.push(index);
            }

            reloadData(false);
            $device.taptic();
          }
        }
      }
    ]
  });

  reloadData();
}

function reloadData(resetIndexes = true) {
  if (resetIndexes) {
    selectedIndexes = [];
  }

  collections = util.userCollections();
  const albumList = $("album-list");
  if (!albumList) {
    return;
  }

  albumList.data = util.convertCollections(collections).map((item, idx) => {
    const collection = collections.$objectAtIndex(idx);
    const color = (() => {
      if (selectedIndexes.includes(idx)) {
        return $color("red");
      } else {
        return $color("text");
      }
    })();

    return {
      "title": {
        "text": util.collectionTitle(item),
        "textColor": color
      },
      "subtitle": {
        "text": `${util.collectionLength(collection)}`,
        "textColor": color
      }
    }
  });
}

async function deleteAlbums() {
  if (selectedIndexes.length === 0) {
    return;
  }

  const albums = $objc("NSMutableArray").$array();
  selectedIndexes.forEach(index => {
    albums.$addObject(collections.$objectAtIndex(index));
  });

  const library = $objc("PHPhotoLibrary").$sharedPhotoLibrary();
  library.$performChanges_completionHandler($block("void", () => {
    $objc("PHAssetCollectionChangeRequest").$deleteAssetCollections(albums);
  }), $block("void, BOOL, NSError *", (success, error) => {
    if (!success) {
      return;
    }

    util.successTaptic();
    $thread.main({
      handler: reloadData
    });
  }));
}