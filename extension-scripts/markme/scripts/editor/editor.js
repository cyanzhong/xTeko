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
  const renderer = require("./renderer").new();
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
        type: "runtime",
        props: {
          id: "renderer",
          view: renderer,
          alpha: 0
        },
        layout: $layout.fill
      },
      {
        type: "web",
        props: {
          id: "mindmap",
          showsProgress: false,
          alpha: 0
        },
        layout: $layout.fill
      }
    ],
    events: {
      disappeared: () => {
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

async function shareImage(textView, path) {
  const html = getHTML(textView);
  const webView = $objc("UIWebView").$alloc().$initWithFrame(textView.$frame());
  webView.$setHidden(true);
  textView.$superview().$addSubview(webView);
  webView.$loadHTMLString_baseURL(html, null);

  $ui.loading(true);
  $delay(2, () => {
    $ui.loading(false);
    const scrollView = webView.$scrollView();
    const image = scrollView.$snapshotForEntireView();
    $share.sheet(image.rawValue());
    webView.$removeFromSuperview();
  });
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
  return util.toHTML(text, withStyle);
}

function getFileName(path) {
  return util.removePathExtension(util.lastPathComponent(path));
}