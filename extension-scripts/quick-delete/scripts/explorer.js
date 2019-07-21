const util = require("./util");
const templates = require("./templates");

exports.open = () => {
  let smartAlbums = null;
  let userCollections = null;

  $app.listen({
    resume: reloadData
  });

  $ui.render({
    props: {
      title: $l10n("MAIN_TITLE"),
      navButtons: [
        {
          title: $l10n("ORGANIZE_ALBUMS"),
          handler: () => {
            const album = require("./album");
            album.open();
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "explorer-list",
          stickyHeader: false,
          template: templates.explorerList
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            const section = indexPath.section;
            const row = indexPath.row;
            let collection = null;
            if (section === 0) {
              // skip
            } else if (section === 1) {
              collection = smartAlbums.$objectAtIndex(row);
            } else if (section === 2) {
              collection = userCollections.$objectAtIndex(row);
            }
            openCollection(collection);
          }
        }
      }
    ],
    events: {
      appeared: () => {
        reloadData();
      }
    }
  });

  function reloadData() {
    smartAlbums = $objc("PHAssetCollection").$fetchAssetCollectionsWithType_subtype_options(2, 2, null);
    userCollections = util.userCollections();

    const convertCollections = collections => {
      return util.convertCollections(collections).map(collection => {
        return {
          title: {
            text: util.collectionTitle(collection)
          },
          subtitle: {
            text: `${util.collectionLength(collection)}`
          }
        }
      });
    }

    $("explorer-list").data = [
      {
        title: "",
        rows: [
          {
            title: {
              text: $l10n("ALL_PHOTOS")
            },
            subtitle: {
              text: `${$objc("PHAsset").$fetchAssetsWithOptions(null).$count()}`
            }
          }
        ]
      },
      {
        title: $l10n("SMART_ALBUMS"),
        rows: convertCollections(smartAlbums)
      },
      {
        title: $l10n("ALBUMS"),
        rows: convertCollections(smartAlbums)
      }
    ];
  }

  reloadData();
}

function openCollection(collection) {
  const waterfallVC = require("./controller").newInstance(collection);
  const rootVC = $ui.controller.runtimeValue();
  const navigationVC = rootVC.$navigationController();
  navigationVC.$pushViewController_animated(waterfallVC, true);
}