var _options = $cache.get("options") || {
  "sound": true,
  "taptic": true,
  "hide-keypad": false,
};

var _soundEnabled = _options["sound"];
var _tapticEnabled = _options["taptic"];
var _hideKeypad = _options["hide-keypad"];

exports.soundEnabled = () => {
  return _soundEnabled;
}

exports.tapticEnabled = () => {
  return _tapticEnabled;
}

exports.hideKeypad = () => {
  return _hideKeypad;
}

exports.open = () => {

  function switchCell(title, on, handler) {
    return {
      type: "view",
      layout: (make, view) => {
        make.left.right.inset(15);
        make.top.bottom.equalTo(0);
      },
      views: [
        {
          type: "label",
          props: {
            text: title
          },
          layout: (make, view) => {
            make.left.equalTo(0);
            make.centerY.equalTo(view.super);
          }
        },
        {
          type: "switch",
          props: {
            on: on
          },
          layout: (make, view) => {
            make.right.equalTo(0);
            make.centerY.equalTo(view.super);
          },
          events: {
            changed: sender => handler(sender.on)
          }
        }
      ]
    }
  }

  let cells = [
    {
      "title": " ",
      "rows": [
        switchCell($l10n("SOUND_ENABLED"), _soundEnabled, on => {
          _soundEnabled = on;
          _options["sound"] = on;
          saveOptions();
        }),
        switchCell($l10n("TAPTIC_ENABLED"), _tapticEnabled, on => {
          _tapticEnabled = on;
          _options["taptic"] = on;
          saveOptions();
        }),
        switchCell($l10n("HIDE_KEYPAD"), _hideKeypad, on => {
          _hideKeypad = on;
          _options["hide-keypad"] = on;
          saveOptions();
        }),
        {
          type: "view",
          layout: (make, view) => {
            make.left.right.inset(15);
            make.top.bottom.equalTo(0);
          },
          views: [
            {
              type: "label",
              props: {
                text: $l10n("KEYBOARD_SETTINGS")
              },
              layout: (make, view) => {
                make.left.equalTo(0);
                make.centerY.equalTo(view.super);
              }
            }
          ]
        }
      ]
    }
  ];

  $ui.push({
    props: {
      title: $l10n("SETTINGS"),
      navButtons: [
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
          data: cells
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            if (indexPath.row == 3) {
              const utility = require("./utility");
              let cell = sender.cell(indexPath);
              utility.showBlinkEffect(cell);

              const settings = require("./key-settings");
              settings.open();
            }
          }
        }
      }
    ]
  });
}

function showReadme() {
  let readme = require("./readme") ;
  readme.show();
}

function saveOptions() {
  $cache.set("options", _options);
}