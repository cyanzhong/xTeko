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

exports.select = completion => {

  $ui.push({
    props: {
      title: "Emoji"
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
          didSelect: (sender, indexPath) => {
            let emoji = lists[selectedIndex][indexPath.item];
            completion(emoji);
            $ui.pop();
          }
        }
      }
    ]
  });

  setIndex(0);
}

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