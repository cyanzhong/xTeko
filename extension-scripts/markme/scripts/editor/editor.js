const util = require("../common/util");
const taptic = require("../common/taptic");
const storage = require("../settings/storage");

let _openedPath = null;
let _openedTextView = null;
$app.listen({
  pause: saveOpenedFile,
  exit: saveOpenedFile,
});

exports.open = path => {
  const textView = require("./text-view").new();
  _openedTextView = textView;
  _openedPath = path;

  $ui.push({
    props: {
      bgcolor: textView.rawValue().bgcolor,
      navButtons: [
        {
          image: util.loadImage("save"),
          handler: () => save(textView, path, true)
        },
        {
          image: util.loadImage("share"),
          handler: () => share(textView, path)
        }
      ]
    },
    views: [
      {
        type: "runtime",
        props: {
          id: "editor",
          view: textView
        },
        layout: (make, view) => {
          make.edges.equalTo(view.super.safeArea);
        }
      },
      {
        type: "markdown",
        props: {
          id: "renderer",
          alpha: 0
        },
        layout: $layout.fill
      }
    ],
    events: {
      appeared: () => {
        util.enableBackGesture(false);
      },
      disappeared: () => {
        util.enableBackGesture(true);
        if (storage.autoSave()) {
          save(textView, path);
        }
      }
    }
  });
  
  const menu = require("./menu");
  menu.setup();

  const text = $file.read(path).string || "";
  textView.$setText(text);
  if (text.length == 0) {
    $delay(0.5, () => {
      textView.$becomeFirstResponder();
    });
  }
}

function save(textView, path, userInitiated=false) {
  if (!userInitiated && !textView.$edited()) {
    return;
  }

  const text = textView.$text();
  const data = util.stringToData(text);

  $file.write({
    data: data,
    path: path
  });

  textView.$resignFirstResponder();

  if (userInitiated) {
    taptic.success();

    $ui.loading(true);
    $delay(0.8, () => $ui.loading(false));
  }
}

function saveOpenedFile() {
  if (storage.autoSave() && _openedTextView && _openedPath) {
    save(_openedTextView, _openedPath);
  }
}

async function share(textView, path) {
  textView.$resignFirstResponder();
  
  const options = [
    $l10n("SHARE_FILE"),
    $l10n("SHARE_IMAGE"),
    $l10n("SHARE_PDF"),
    $l10n("SHARE_HTML"),
    $l10n("COPY_HTML"),
  ];

  const INDEX = {
    SHARE_FILE: 0,
    SHARE_IMAGE: 1,
    SHARE_PDF: 2,
    SHARE_HTML: 3,
    COPY_HTML: 4,
  }

  const {index} = await $ui.menu(options);
  switch (index) {
    case INDEX.SHARE_FILE:
      shareFile(textView, path);
      break;
    case INDEX.SHARE_IMAGE:
      shareImage(textView, path);
      break;
    case INDEX.SHARE_PDF:
      sharePDF(textView, path);
      break;
    case INDEX.SHARE_HTML:
      shareHTML(textView, path);
      break;
    case INDEX.COPY_HTML:
      copyHTML(textView, path);
      break;
  }
}

function shareFile(textView, path) {
  const file = $file.read(path);
  $share.sheet([util.lastPathComponent(path), file]);
}

function shareImage(textView, path) {
  $ui.loading(true);
  const html = getHTML(textView);
  const webView = $objc("WKWebView").$alloc().$initWithFrame(textView.$frame());
  const handler = require("./handler").connect(webView);

  webView.$setHidden(true);
  webView.$loadHTMLString_baseURL(html, null);

  const configuration = webView.$configuration();
  configuration.$userContentController().$addScriptMessageHandler_name(handler, "render");

  const window = $objc("UIApplication").$sharedApplication().$keyWindow();
  window.$addSubview(webView);
}

async function sharePDF(textView, path) {
  $ui.loading(true);
  const html = getHTML(textView);
  const fileName = getFileName(path);
  const {data} = await $pdf.make({
    html: html
  });

  $ui.loading(false);
  $share.sheet([`${fileName}.pdf`, data]);
}

function shareHTML(textView, path) {
  const html = getHTML(textView);
  const fileName = getFileName(path);
  const data = $data({"string": html});
  $share.sheet([`${fileName}.html`, data]);
}

function copyHTML(textView, path) {
  const html = getHTML(textView, false);
  $clipboard.text = html;
}

function getHTML(textView, withStyle=true) {
  const text = textView.$text().rawValue();
  const content = $text.markdownToHtml(text);
  if (withStyle) {
    const renderer = $file.read("assets/template.html");
    let html = renderer.string;
    html = html.replace("{{content}}", content);
    html = html.replace("{{style}}", (() => {
      const file = $file.read("assets/style.css");
      return file ? `<style>${file.string}</style>` : "";
    })());
    return html;
  } else {
    return content;
  }
}

function getFileName(path) {
  return util.removePathExtension(util.lastPathComponent(path));
}