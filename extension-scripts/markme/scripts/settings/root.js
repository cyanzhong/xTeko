const colors = require("../common/colors");
const template = require("../templates/settings");
const storage = require("./storage");

exports.open = () => {
  $ui.push({
    props: {
      title: $l10n("SETTINGS")
    },
    views: [
      {
        type: "list",
        props: {
          id: "settings",
          stickyHeader: false,
          template: template
        },
        layout: $layout.fill,
        events: {
          forEachItem: (item, indexPath) => {
            const contentView = item.runtimeValue();
            const cell = contentView.$superview();
            if (indexPath.section == 0) {
              cell.$setAccessoryType(1);
            } else {
              cell.$setAccessoryType(0);
            }
          },
          didSelect: (sender, indexPath) => {
            const SECTIONS = {
              THEME: 0,
              IMAGES: 1,
              AUTO_SAVE: 2,
              EXPORT: 3,
            }

            if (indexPath.section == SECTIONS.THEME) {
              const INDEX = {
                THEME: 0,
                FONT: 1,
                FONT_SIZE: 2,
                LINE_PADDING: 3,
                CUSTOM_CSS: 4,
              };
  
              switch (indexPath.row) {
                case INDEX.THEME:
                  require("./theme").open(reloadData);
                  break;
                case INDEX.FONT:
                  require("./font").open(reloadData);
                  break;
                case INDEX.FONT_SIZE:
                  require("./font-size").open(reloadData);
                  break;
                case INDEX.LINE_PADDING:
                  require("./line-padding").open(reloadData);
                  break;
                case INDEX.CUSTOM_CSS:
                  require("./style-editor").open();
                  break;
              }
            } else if (indexPath.section == SECTIONS.IMAGES) {
              const manager = require("../images/manager");
              manager.open();
            } else if (indexPath.section == SECTIONS.EXPORT) {
              exportLocalFiles();
            }
          }
        }
      }
    ]
  });

  reloadData();
}

function reloadData() {
  const settings = $("settings");
  if (settings == null) {
    return;
  }

  const styleCell = (title, subtitle) => {
    return {
      title: {
        text: title,
        textColor: colors.text,
        align: $align.left
      },
      subtitle: {
        text: subtitle
      },
      switcher: {
        hidden: true
      }
    };
  }

  settings.data = [
    {
      title: " ",
      rows: [
        styleCell($l10n("THEME"), storage.theme()),
        styleCell($l10n("FONT"), storage.font()),
        styleCell($l10n("FONT_SIZE"), `${storage.fontSize()}`),
        styleCell($l10n("LINE_PADDING"), `${storage.linePadding()}`),
        styleCell($l10n("CUSTOM_CSS"), ""),
      ]
    },
    {
      title: "",
      rows: [
        styleCell($l10n("LOCAL_IMAGES"), "")
      ]
    },
    {
      title: "",
      rows: [
        {
          title: {
            text: $l10n("AUTO_SAVE"),
            textColor: colors.text,
            align: $align.left
          },
          switcher: {
            on: storage.autoSave(),
            hidden: false,
            info: {
              key: "auto-save"
            }
          }
        }
      ]
    },
    {
      title: "",
      rows: [
        {
          title: {
            text: $l10n("EXPORT_LOCAL_FILES"),
            textColor: colors.blue,
            align: $align.center
          },
          switcher: {
            hidden: true
          }
        }
      ]
    }
  ];
}

function exportLocalFiles() {
  const util = require("../common/util");
  util.shareFolder("files");
}