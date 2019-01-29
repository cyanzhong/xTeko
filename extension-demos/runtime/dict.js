$objc("NSBundle").$bundleWithPath("/System/Library/PrivateFrameworks/DictionaryUI.framework").$load();

const manager = $objc("DUDictionaryManager").$assetManager();
var definitions = [];

$ui.render({
  props: {
    navButtons: [
      {
        icon: "002",
        handler: () => {
          let vc = $objc("_UIRemoteDictionaryViewController").$alloc().$initWithStyle(0);
          let source = $ui.controller.runtimeValue();
          source.$pushController(vc);
        }
      }
    ]
  },
  views: [
    {
      type: "input",
      props: {
        type: $kbType.ascii
      },
      layout: (make, view) => {
        make.left.top.right.inset(10);
        make.height.equalTo(36);
      },
      events: {
        ready: sender => sender.focus(),
        changed: sender => searchText(sender.text)
      }
    },
    {
      type: "list",
      props: {
        id: "result-list",
        rowHeight: 50,
        template: {
          views: [
            {
              type: "label",
              props: {
                id: "term-label",
                font: $font(15)
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.inset(3);
                make.height.equalTo(25);
              }
            },
            {
              type: "label",
              props: {
                id: "result-label",
                font: $font(15)
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.bottom.inset(3);
                make.height.equalTo(25);
              }
            }
          ]
        }
      },
      layout: (make, view) => {
        make.top.equalTo(56);
        make.left.bottom.right.equalTo(0);
      },
      events: {
        didSelect: (sender, indexPath) => {
          let index = indexPath.row;
          let definition = definitions[index];
          showDefinition(definition.$longDefinition().rawValue(), definition.$term().rawValue());
        }
      }
    }
  ]
});

function searchText(text) {

  let results = [];
  if (manager.$__hasDefinitionForTerm(text)) {
    let values = manager.$__definitionValuesForTerm(text);
    for (var idx=0; idx<values.$count(); ++idx) {
      let value = values.$objectAtIndex(idx);
      results.push(value);
    }
  }

  definitions = [];
  $("result-list").data = results.map(result => {

    definitions.push(result);
    let elements = result.$definitionElements().rawValue();
    let senses = (elements["DCSTextElementKeySenses"] || []).join(", ");
    let pos = elements["DCSTextElementKeyPartOfSpeech"];
    let term = result.$term().rawValue();

    if (senses.length == 0) {
      return null;
    }

    return {
      "term-label": {
        text: pos ? `${term}: ${pos}` : term
      },
      "result-label": {
        text: senses
      }
    }
  });
}

function showDefinition(definition, term) {
  $ui.push({
    props: {
      title: term
    },
    views: [
      {
        type: "web",
        props: {
          showsProgress: false,
          html:
          `
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1.0, user-scalable=no">
            </head>
            <body>
            ${definition}
            </body>
          </html>
          `
        },
        layout: $layout.fill
      }
    ]
  });
}