let helper = require("scripts/helper");
let text = helper.getText();
let qrcode = $qrcode.encode(text);

$ui.push({
  props: {
    title: text
  },
  views: [
    {
      type: "button",
      props: {
        title: $l10n("COPY")
      },
      layout: (make, view) => {
        make.left.bottom.inset(10);
        make.width.equalTo(view.super).multipliedBy(0.5).offset(-15);
        make.height.equalTo(32);
      },
      events: {
        tapped: copy
      }
    },
    {
      type: "button",
      props: {
        title: $l10n("SHARE")
      },
      layout: (make, view) => {
        make.right.bottom.inset(10);
        make.width.equalTo(view.super).multipliedBy(0.5).offset(-15);
        make.height.equalTo(32);
      },
      events: {
        tapped: share
      }
    },
    {
      type: "image",
      props: {
        id: "qrcode-image",
        image: qrcode,
        bgcolor: $color("clear"),
        contentMode: $contentMode.scaleAspectFit
      },
      layout: (make, view) => {
        make.left.top.right.equalTo(0);
        make.bottom.inset(52);
      }
    }
  ]
});

function copy() {
  $clipboard.image = $("qrcode-image").image;
  $ui.pop();
}

function share() {
  $share.sheet($("qrcode-image").image);
  $ui.pop();
}