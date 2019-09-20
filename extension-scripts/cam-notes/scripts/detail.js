const utility = require("./utility");

exports.show = (note, handlers) => {
  let image = utility.loadImage(note);
  $ui.push({
    props: {
      title: note.text,
      navButtons: [
        {
          title: $l10n("DELETE"),
          handler: () => deleteNote(note, handlers["deleted"])
        }
      ]
    },
    views: [
      {
        type: "view",
        layout: (make, view) => {
          make.edges.equalTo(view.super.safeArea);
        },
        views: [
          {
            type: "text",
            props: {
              bgcolor: $color("#eef1f1"),
              text: note.text,
              font: $font(18),
              keyboardDismissMode: 1,
              insets: $insets(10, 10, 10, 10)
            },
            layout: (make, view) => {
              make.left.top.right.inset(0);
              make.height.equalTo(64);
            },
            events: {
              didEndEditing: sender => {
                note.text = sender.text;
                handlers["updated"](note);
              }
            }
          },
          {
            type: "image",
            props: {
              image: image,
              contentMode: $contentMode.scaleAspectFit
            },
            layout: (make, view) => {
              make.left.bottom.right.equalTo(0);
              make.top.equalTo(64);
            },
            events: {
              tapped: () => $quicklook.open({"image": image})
            }
          }
        ]
      }
    ]
  });
}

async function deleteNote(note, handler) {

  let actions = [$l10n("OK"), $l10n("CANCEL")];

  let {index} = await $ui.alert({
    title: `${$l10n("DELETE")} "${note.text}"`,
    actions: actions
  });

  if (index === 0) {
    handler();
    $ui.pop();
  }
}