const util = require("./util");

exports.run = () => {
  $ui.render({
    props: {
      title: "Hey, Panda!",
      navButtons: [
        {
          title: $l10n("SHARE"),
          symbol: util.ios13 ? "square.and.arrow.up" : null,
          handler: shareImage
        },
        {
          title: $l10n("COPY"),
          symbol: util.ios13 ? "doc.on.doc" : null,
          handler: copyImage
        }
      ]
    },
    views: [
      {
        type: "input",
        props: {
          id: "text-field"
        },
        layout: (make, view) => {
          make.left.top.right.inset(6);
          make.height.equalTo(36);
        },
        events: {
          ready: sender => sender.focus(),
          changed: sender => {
            const text = sender.text;
            updateText(text);
          }
        }
      },
      {
        type: "view",
        props: {
          id: "canvas"
        },
        layout: (make, view) => {
          make.centerX.equalTo(view.super);
          make.size.equalTo($size(250, 207));
          make.top.equalTo($("text-field").bottom).offset(6);
        },
        views: [
          {
            type: "image",
            props: {
              src: "assets/panda.png"
            },
            layout: $layout.fill
          }
        ]
      }
    ]
  });

  insertLabels();
}

function insertLabels() {
  const canvas = $("canvas");
  const points = [[30, 82], [52, 60], [80, 42], [111, 35], [142, 37], [172, 46], [196, 64], [215, 90], [228, 120]];
  points.forEach((point, idx) => {
    const x = point[0];
    const y = point[1];
    canvas.add({
      type: "label",
      props: {
        id: `label@${idx}`,
        align: $align.center,
        font: $font("bold", 22)
      },
      layout: (make, view) => {
        make.size.equalTo($size(30, 30));
        make.left.equalTo(x - 15);
        make.top.equalTo(y - 15);
      }
    });
  });
}

function updateText(text) {
  const chars = [...text].filter(item => item.length > 0 && item != "️");
  let cursor = 0;
  for (let idx=0; idx<9; ++idx) {
    const label = $(`label@${idx}`);
    label.text = chars[cursor] || "";
    cursor = (cursor + 1) % chars.length;
  }
}

function copyImage() {
  const image = exportAsImage();
  $clipboard.image = image;
  util.successTaptic();
}

function shareImage() {
  const image = exportAsImage();
  $share.sheet(image);
  util.successTaptic();
}

function exportAsImage() {
  const canvas = $("canvas");
  const image = canvas.snapshot;
  return image;
}