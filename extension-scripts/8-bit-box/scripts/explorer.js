var files = [];

exports.open = () => {
  
  $ui.render({
    props: {
      title: "8BitBox",
      navButtons: [
        {
          icon: "104",
          handler: importFile
        },
        {
          icon: "008",
          handler: showReadme
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

function showReadme() {
  let readme = require("./readme") ;
  readme.show();
}

async function importFile() {
  let data = await $drive.open();
  $file.write({
    data: data,
    path: `www/roms/${data.fileName}`
  });
  reloadData();
}