const settings = require("./settings");

var files = [];

exports.open = () => {
  
  $ui.render({
    props: {
      title: "JsDosBox",
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
          bgcolor: $color("#eef1f1"),
          header: {
            type: "button",
            props: {
              height: 32,
              bgcolor: $color("clear"),
              radius: 0
            },
            events: {
              tapped: openReadme
            },
            views: [
              {
                type: "image",
                props: {
                  id: "arrow",
                  src: "assets/arrow.png"
                },
                layout: (make, view) => {
                  make.right.inset(10);
                  make.centerY.equalTo(view.super);
                  make.size.equalTo($size(6, 9));
                }
              },
              {
                type: "label",
                props: {
                  text: $l10n("README"),
                  textColor: $color("#666666"),
                  font: $font(13)
                },
                layout: (make, view) => {
                  make.right.equalTo($("arrow").left).offset(-8);
                  make.centerY.equalTo(view.super);
                }
              }
            ]
          },
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
          didSelect: async(sender, indexPath) => {
            let path = files[indexPath.row];
            let options = [$l10n("LAUNCH"), $l10n("LAUNCH_WITH_COMMAND"), $l10n("CONFIGURE")];
            let {index} = await $ui.menu(options);
            if (index == 0) {
              launch(path);
            } else if (index == 1) {
              launchWithCommand(path);
            } else {
              configure(path);
            }
          }
        }
      }
    ]
  });

  reloadData();
}

function launch(path) {
  const {loadFile} = require("./ui");
  loadFile(path, "");
}

async function launchWithCommand(path) {
  let command = await $input.text({
    type: $kbType.ascii,
    text: settings.getCommand(path),
    placeholder: $l10n("INPUT_LAUNCH_COMMAND")
  });

  if (command == null) {
    return;
  }

  await $wait(0.2);
  const {loadFile} = require("./ui");
  loadFile(path, command);
  settings.setCommand(path, command);
}

function configure(path) {
  const {loadFile} = require("./configure");
  loadFile(path);
}

function reloadData() {
  files = $file.list("www/roms").filter(item => {
    return item.toLowerCase().endsWith(".zip");
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
  settings.open();
}

function openReadme() {
  const readme = require("./readme");
  readme.open();
}