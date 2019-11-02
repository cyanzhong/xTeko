const util = require("./util");
const settings = require("./settings");
const builder = require("./builder");

let modeMenu = null;
let webView = null;
let textView = null;

$define({
  type: "EventHandlers",
  events: {
    "didSelectMenuItem:": sender => {
      util.hideKeyboard();
      const index = sender.$selectedSegmentIndex();
      setVisibleView(index);
    },
    "close": () => {
      $app.close();
    },
    "selectMode": () => {
      const picker = require("./mode-picker");
      picker.open(setMode);
    },
    "settings": () => {
      $prefs.open();
    },
    "exportImage": () => {
      if (modeMenu.index == 0) {
        setText();
      }
      util.hideKeyboard();
      evaluate("exportImage()");
    }
  }
});

function init() {
  const text = $context.text || $clipboard.text || "";
  textView.text = text;
  setStyle();

  if (text.length > 0) {
    setVisibleView(1);

    webView.alpha = 0;
    $ui.animate({
      duration: 0.4,
      animation: () => {
        webView.alpha = 1;
      }
    });

    prettify();
  } else {
    textView.focus();
  }
}

function setVisibleView(index) {
  modeMenu.index = index;
  if (index == 0) {
    textView.hidden = false;
    webView.hidden = true;
    evaluate("getText()", text => {
      textView.text = text;
    });
  } else {
    textView.hidden = true;
    webView.hidden = false;
    setText();
  }
}

function setText() {
  const text = $text.base64Encode(textView.text);
  const mode = settings.mode();
  evaluate(`setText('${text}', '${mode}')`);
}

function setMode() {
  const mode = settings.mode();
  evaluate(`setMode('${mode}')`);
}

function setStyle() {
  evaluate(`setStyle({
    'text': '${$text.base64Encode(textView.text)}',
    'mode': '${settings.mode()}',
    'theme': '${settings.theme()}',
    'fontName': '${settings.fontName()}',
    'fontSize': '${settings.fontSize()}',
    'lineHeight': '${settings.lineHeight()}',
    'lineNumbers': ${settings.lineNumbers()},
    'showInvisibles': ${settings.showInvisibles()},
    'maxWidth': '${settings.maxWidth()}',
    'paddingX': ${settings.paddingX()},
    'paddingY': ${settings.paddingY()},
  })`);
}

function prettify() {
  evaluate("prettify()", text => {
    textView.text = text;
  });
}

function evaluate(script, handler) {
  if (webView) {
    webView.eval({
      script: script,
      handler: handler
    });
  }
}

exports.open = () => {

  $ui.render({
    views: [
      {
        type: "text",
        props: {
          id: "textView",
          type: $kbType.ascii,
          font: $font("Menlo", 15),
          bgcolor: $color("#2e3440"),
          textColor: $color("#e0e0e0"),
          tintColor: $color("#e0e0e0")
        },
        events: {
          ready: sender => {
            textView = sender;
          }
        },
        layout: $layout.fill
      },
      {
        type: "web",
        props: {
          id: "webView",
          hidden: true,
          html: $file.read("www/index.html").string,
          showsProgress: false
        },
        events: {
          ready: sender => {
            webView = sender;
            const scroller = sender.scrollView;
            scroller.keyboardDismissMode = 2;
          },
          didFinish: init,
          didCreateImage: async(data) => {
            const image = util.processImage(data);
            const {index} = await $ui.menu([
              $l10n("COPY"),
              $l10n("QUICKLOOK"),
              $l10n("SHARE")
            ]);
            if (index == 0) {
              $clipboard.image = image;
              util.successTaptic();
            } else if (index == 1) {
              $quicklook.open({
                image: image
              });
            } else if (index == 2) {
              $share.sheet(image);
            }
          }
        },
        layout: $layout.fill
      }
    ],
    events: {
      appeared: setStyle
    }
  });

  const handlers = $objc("EventHandlers").$new();
  $objc_retain(handlers);

  const controller = $ui.controller.runtimeValue();
  const navigationItem = controller.$navigationItem();
  navigationItem.$setTitleView((() => {
    const items = $objc("NSMutableArray").$array();
    items.$addObject($l10n("EDIT"));
    items.$addObject($l10n("PREVIEW"));

    const menu = $objc("UISegmentedControl").$alloc().$initWithItems(items);
    menu.$setBackgroundColor($rgb(238, 238, 239).ocValue());
    menu.$setSelectedSegmentIndex(0);
    menu.$addTarget_action_forControlEvents(handlers, "didSelectMenuItem:", 1 << 12);
    modeMenu = menu.jsValue();
    return menu;
  })());

  const leftItems = $objc("NSMutableArray").$array();
  const rightItems = $objc("NSMutableArray").$array();

  const closeItem = builder.navigationItem("xmark", handlers, "close");
  leftItems.$addObject(closeItem);

  const modeItem = builder.navigationItem("arrow.right.arrow.left", handlers, "selectMode");
  leftItems.$addObject(modeItem);

  const settingsItem = builder.navigationItem("gear", handlers, "settings");
  rightItems.$addObject(settingsItem);

  const exportItem = builder.navigationItem("square.and.arrow.up", handlers, "exportImage");
  rightItems.$addObject(exportItem);

  navigationItem.$setLeftBarButtonItems(leftItems);
  navigationItem.$setRightBarButtonItems(rightItems);
}

$app.listen({
  "prettify": () => {
    setText();
    prettify();
    util.successTaptic();
    $ui.pop();
  }
});