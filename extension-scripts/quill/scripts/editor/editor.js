const constants = require("../define/constants");
const toolbar = require("./toolbar");
const util = require("../common/util");
const storage = require("../settings/storage");
const keyman = require("../common/keyman");

let _openedPath = null;
$app.listen({
  pause: saveOpenedFile,
  exit: saveOpenedFile,
});

let _keyHeight = 0;
keyman.observe(height => {
  _keyHeight = height;
});

exports.open = path => {
  _openedPath = path;

  $ui.push({
    props: {
      title: util.removePathExtension(path.split("/").pop()),
      navButtons: [
        {
          image: util.loadImage("save"),
          handler: () => save(path, true)
        },
        {
          image: util.loadImage("share"),
          handler: () => share(path)
        }
      ]
    },
    views: [
      {
        type: "web",
        props: {
          id: "editor",
          html: (() => {
            let html = $file.read("assets/editor/quill.html").string;
            html = html.replace("{{placeholder}}", $l10n("PLACEHOLDER"));
            return html;
          })(),
          showsProgress: false
        },
        layout: $layout.fill,
        events: {
          ready: sender => {
            const scroller = sender.scrollView;
            scroller.keyboardDismissMode = 2;
          },
          didFinish: sender => {
            const fonts = JSON.stringify(constants.fontNames);
            const contents = $file.read(path).string || "{}";
            sender.eval({
              "script": `initEditor({
                fonts: ${fonts},
                contents: ${contents},
              })`
            });
          },
          editorChanged: format => {
            toolbar.update(format);
          },
          heightChanged: height => {
            const editor = $("editor");
            if (!editor) {
              return;
            }

            const scroller = editor.scrollView;
            if (!scroller) {
              return;
            }

            const aboveHeight = editor.frame.height - _keyHeight;
            if (height > aboveHeight) {
              const offset = scroller.contentOffset.y + 24;
              scroller.contentOffset = $point(0, offset);
            }
          }
        }
      }
    ],
    events: {
      disappeared: () => {
        if (storage.autoSave()) {
          save(path);
        }
      }
    }
  });
}

function saveOpenedFile() {
  if (storage.autoSave() && _openedPath) {
    save(_openedPath);
  }
}

function save(path, userInitiated=false) {
  const editor = $("editor");
  if (!editor) {
    return;
  }

  editor.eval({
    "script": "getContents()",
    "handler": contents => {
      if (!contents) {
        return;
      }

      const data = $data({"string": JSON.stringify(contents)});
      $file.write({
        data: data,
        path: path
      });

      editor.ocValue().$resignFirstResponder();
    }
  });

  if (userInitiated) {
    util.successTaptic();

    $ui.loading(true);
    $delay(0.8, () => $ui.loading(false));
  }
}

async function share(path) {
  const editor = $("editor");
  editor.ocValue().$resignFirstResponder();

  const options = [
    $l10n("SHARE_FILE"),
    $l10n("SHARE_IMAGE"),
    $l10n("SHARE_PDF"),
    $l10n("SHARE_HTML"),
    $l10n("COPY_HTML"),
    $l10n("COPY_RICH_CONTENT"),
  ];

  const INDEX = {
    SHARE_FILE: 0,
    SHARE_IMAGE: 1,
    SHARE_PDF: 2,
    SHARE_HTML: 3,
    COPY_HTML: 4,
    COPY_RICH_CONTENT: 5,
  }

  const {index} = await $ui.menu(options);
  switch (index) {
    case INDEX.SHARE_FILE:
      shareFile(editor, path);
      break;
    case INDEX.SHARE_IMAGE:
      shareImage(editor, path);
      break;
    case INDEX.SHARE_PDF:
      sharePDF(editor, path);
      break;
    case INDEX.SHARE_HTML:
      shareHTML(editor, path);
      break;
    case INDEX.COPY_HTML:
      copyHTML(editor, path);
      break;
    case INDEX.COPY_RICH_CONTENT:
      copyRichContent(editor, path);
      break;
  }
}

function shareFile(editor, path) {
  const file = $file.read(path);
  $share.sheet([util.lastPathComponent(path), file]);
}

async function shareImage(editor, path) {
  const html = await getHTML(editor);
  const webView = $objc("UIWebView").$alloc().$initWithFrame(editor.ocValue().$frame());
  webView.$setHidden(true);
  editor.ocValue().$superview().$addSubview(webView);
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

async function sharePDF(editor, path) {
  $ui.loading(true);
  const html = await getHTML(editor);
  const fileName = getFileName(path);
  const {data} = await $pdf.make({
    html: html
  });

  $ui.loading(false);
  $share.sheet([`${fileName}.pdf`, data]);
}

async function shareHTML(editor, path) {
  const html = await getHTML(editor);
  const fileName = getFileName(path);
  const data = $data({"string": html});
  $share.sheet([`${fileName}.html`, data]);
}

async function copyHTML(editor, path) {
  const html = await getHTML(editor, false);
  $clipboard.text = html;
  util.successTaptic();
}

function copyRichContent(editor, path) {
  const editorOC = editor.ocValue();
  editorOC.$selectAll(null);
  editorOC.$copy($objc("UIApplication").$sharedApplication());
  editorOC.$resignFirstResponder();
  util.successTaptic();
}

async function getHTML(editor) {
  const [html] = await editor.eval("getHTML()");
  return util.wrapHTML(html);
}

function getFileName(path) {
  return util.removePathExtension(util.lastPathComponent(path));
}