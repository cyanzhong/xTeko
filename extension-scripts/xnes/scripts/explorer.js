var files = [];

exports.open = () => {
  
  $ui.render({
    props: {
      title: "xNES",
      navButtons: [
        {
          icon: "002",
          handler: openSettings
        },
        {
          icon: "104",
          handler: importFile
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          id: "rom-list",
          actions: [
            {
              title: "delete",
              handler: (sender, indexPath) => {
                let name = files[indexPath.row];
                $file.delete(`www/roms/${name}`);
                files.splice(indexPath.row, 1);
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            const ui = require("./ui");
            let path = files[indexPath.row];
            ui.loadGame(path);
          }
        }
      }
    ]
  });

  reloadData();
}

function reloadData() {
  files = $file.list("www/roms").filter(item => {
    return item.toLowerCase().endsWith(".nes");
  }).sort();
  $("rom-list").data = files;
}

async function importFile() {
  let data = await $drive.open();
  $file.write({
    data: data,
    path: `www/roms/${data.fileName}`
  });
  reloadData();
}

function openSettings() {
  const settings = require("./settings");
  settings.open();
}