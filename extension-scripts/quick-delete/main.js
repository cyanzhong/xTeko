const util = require("./scripts/util");
util.setup();

const updater = require("./scripts/updater");
updater.check();

const authBlock = $block("void, NSInteger", status => {
  $thread.main({
    handler: () => {
      if (status === 3) {
        const explorer = require("./scripts/explorer");
        explorer.open();
      } else {
        $ui.alert({
          title: $l10n("NOT_AUTHORIZED"),
          actions: [
            {
              title: $l10n("OPEN_SETTINGS"),
              handler: () => {
                const url = $objc("NSURL").$URLWithString("app-settings:");
                const application = $objc("UIApplication").$sharedApplication();
                application.$openURL_options_completionHandler(url, null, null);
              }
            },
            {
              title: $l10n("QUIT"),
              handler: () => {}
            }
          ]
        });
      }
    }
  });
});

$objc("PHPhotoLibrary").$requestAuthorization(authBlock);