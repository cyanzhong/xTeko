const utility = require("./utility");
const settings = require("./settings");

exports.loadFile = path => {
  $ui.push({
    props: {
      title: utility.removeExtension(path)
    },
    views: [
      {
        type: "list",
        props: {
          id: "cfg-list",
          stickyHeader: false
        },
        layout: $layout.fill,
        events: {
          didSelect: async(sender, indexPath) => {
            let text = await $input.text({
              type: $kbType.ascii,
              text: (() => {
                if (indexPath.section == 0) {
                  return settings.getCommand(path);
                } else {
                  return settings.getFolder(path);
                }
              })(),
              placeholder: (() => {
                if (indexPath.section == 0) {
                  return $l10n("COMMAND_EXAMPLE")
                } else {
                  return $l10n("LETTERS_N_NUMBERS")
                }
              })()
            });

            if (text == null) {
              return;
            }

            if (indexPath.section == 0) {
              settings.setCommand(path, text);
            } else if (indexPath.section == 1) {
              if (utility.isValidFolder(text)) {
                settings.setFolder(path, text);
              } else {
                $ui.alert($l10n("INVALID_FOLDER"));
              }
            }

            reloadData();
          }
        }
      }
    ]
  });

  function reloadData() {
    $("cfg-list").data = [
      {
        title: $l10n("LAUNCH_COMMAND"),
        rows: [settings.getCommand(path)]
      },
      {
        title: $l10n("MOUNT_FOLDER"),
        rows: [settings.getFolder(path)]
      }
    ]
  }

  reloadData();
}