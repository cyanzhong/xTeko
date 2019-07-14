const constants = require("../define/constants");
const colors = require("../define/colors");
const template = require("../templates/settings");
const storage = require("./storage");
const util = require("../common/util");

exports.open = () => {
  $ui.push({
    props: {
      title: $l10n("SETTINGS"),
      navButtons: [
        {
          image: util.loadImage("info"),
          handler: () => {
            const readme = require("./readme");
            readme.open();
          }
        }
      ]
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
          didSelect: (sender, indexPath) => {
            const SECTIONS = {
              OPTIONS: 0,
              THEME: 1,
              EXPORT: 2,
            }

            const section = indexPath.section;
            if (section === SECTIONS.OPTIONS) {
              const ROWS = {
                IMAGE_QUALITY: 0,
                STYLE_SHEETS: 1,
                AUTO_SAVE: 2,
              }
              if (indexPath.row === ROWS.STYLE_SHEETS) {
                styleSheetsHelp();
              }
            } else if (section == SECTIONS.THEME) {
              setTheme(indexPath.row);
            } else if (section === SECTIONS.EXPORT) {
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

  const colorCell = (title, color, index) => {
    const selected = ($cache.get("theme-index") || 0) == index;
    const tintColor = selected ? colors.blue : colors.text;

    return {
      title: {
        text: title,
        textColor: tintColor,
        align: $align.left
      },
      switcher: {
        hidden: true
      },
      theme: {
        hidden: false,
        bgcolor: color,
        borderColor: tintColor
      },
      quality: {
        hidden: true
      }
    };
  }

  settings.data = [
    {
      title: " ",
      rows: [
        {
          title: {
            text: $l10n("IMAGE_QUALITY"),
            textColor: colors.text,
            align: $align.left
          },
          switcher: {
            hidden: true
          },
          theme: {
            hidden: true
          },
          quality: {
            hidden: false,
            items: [$l10n("LOW"), $l10n("MEDIUM"), $l10n("HIGH")],
            index: storage.imageQuality()
          }
        },
        {
          title: {
            text: $l10n("CUSTOM_STYLE_SHEETS"),
            textColor: colors.text,
            align: $align.left
          },
          switcher: {
            hidden: true
          },
          theme: {
            hidden: true
          },
          quality: {
            hidden: true
          }
        },
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
          },
          theme: {
            hidden: true
          },
          quality: {
            hidden: true
          }
        }
      ]
    },
    {
      title: $l10n("THEME"),
      rows: [
        colorCell($l10n("WHITE"), $rgb(255, 255, 255), 0),
        colorCell($l10n("SEPIA"), $rgb(248, 241, 227), 1),
        colorCell($l10n("GRAY"), $rgb(74, 74, 77), 2),
        colorCell($l10n("NIGHT"), $rgb(18, 18, 18), 3),
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
          },
          theme: {
            hidden: true
          },
          quality: {
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

function styleSheetsHelp() {
  $ui.alert($l10n("STYLE_SHEETS_HELP"));
}

const themes = [
  "background-color: rgb(255, 255, 255);\n  color: rgb(27, 27, 27);",
  "background-color: rgb(248, 241, 227);\n  color: rgb(79, 50, 28);",
  "background-color: rgb(74, 74, 77);\n  color: rgba(255, 255, 255, 0.78);\n  caret-color: white;",
  "background-color: rgb(18, 18, 18);\n  color: rgb(176, 176, 176);\n  caret-color: lightgray;",
];

function setTheme(index) {
  const theme = themes[index];
  const style = `body {\n  ${theme}\n}`;
  $file.write({
    data: $data({"string": style}),
    path: constants.themePath
  });

  util.successTaptic();
  $cache.set("theme-index", index);
  $delay(0.3, () => reloadData());
}