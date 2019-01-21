let types = [];
let lists = [];
let categoryClass = $objc("UIKeyboardEmojiCategory");
let categories = categoryClass.$categories();
let selectedIndex = 0;

for (var type=0; type<categories.$count(); ++type) {
  let category = categoryClass.$categoryForType(type);
  let categoryName = category.$name();

  if (!categoryName) {
    continue;
  }

  let array = category.$emoji();
  if (!array) {
    continue;
  }

  let categoryType = categoryClass.$displayName(type).rawValue();
  let list = [];
  
  for (var idx=0; idx<array.$count(); ++idx) {
    let item = array.$objectAtIndex(idx);
    let string = item.$emojiString();
    list.push(string.rawValue());
  }

  types.push(categoryType);
  lists.push(list);
}

$ui.push({
  props: {
    title: $l10n("Big Emoji")
  },
  views: [
    {
      type: "menu",
      props: {
        id: "emoji-type-menu",
        segmentWidthStyle: 1,
        items: types
      },
      layout: (make, view) => {
        make.left.top.right.equalTo(0);
        make.height.equalTo(44);
      },
      events: {
        changed: sender => setIndex(sender.index)
      }
    },
    {
      type: "matrix",
      props: {
        id: "emoji-matrix",
        columns: 6,
        itemHeight: 50,
        spacing: 25,
        template: {
          views: [
            {
              type: "label",
              props: {
                id: "label",
                align: $align.center,
                font: $font(32),
                autoFontSize: true
              },
              layout: $layout.fill
            }
          ]
        }
      },
      layout: (make, view) => {
        make.top.equalTo($("emoji-type-menu").bottom);
        make.left.bottom.right.equalTo(0);
      },
      events: {
        didSelect: async(sender, indexPath) => {
          let image = createImage(lists[selectedIndex][indexPath.item]);
          let options = [$l10n("COPY"), $l10n("SHARE")];
          let {index} = await $ui.menu(options);
          if (index === 0) {
            $clipboard.image = image;
          } else {
            $quicklook.open({"image": image});
          }
        }
      }
    }
  ]
});

function setIndex(index) {
  selectedIndex = index;
  $("emoji-matrix").data = lists[index].map(item => {
    return {
      label: {
        text: item
      }
    };
  });
}

function createImage(emoji) {
  let canvas = $ui.create({"type": "view"});
  canvas.frame = $rect(0, 0, 120, 120);
  canvas.add({
    type: "label",
    props: {
      text: emoji,
      font: $font(100),
      align: $align.center,
      frame: $rect(0, 0, 120, 120)
    }
  });
  return canvas.snapshot;
}

setIndex(0);