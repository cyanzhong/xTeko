const util = require("./util");
const storage = require("./storage");

exports.open = () => {
  $ui.push({
    props: {
      title: $l10n("USER_AGENT"),
      navButtons: [
        {
          image: util.loadImage("save"),
          handler: saveButtonTapped
        }
      ]
    },
    views: [
      {
        type: "text",
        props: {
          id: "ua-text",
          type: $kbType.ascii,
          text: storage.userAgent()
        },
        layout: $layout.fill,
        events: {
          ready: sender => {
            $delay(0.5, () => sender.focus());
          }
        }
      }
    ]
  });
}

function saveButtonTapped() {
  const view = $("ua-text");
  const userAgent = view.text;
  storage.setUserAgent(userAgent);

  util.successTaptic();
  view.blur();
}