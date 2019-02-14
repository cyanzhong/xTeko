$objc("NSBundle").$bundleWithPath("/System/Library/PrivateFrameworks/DictionaryUI.framework").$load();

$app.strings = {
  "en": {
    "MAIN_TITLE": "Dictionary",
    "SEARCH": "Search",
    "SEARCH_WEB": "Search Web",
    "MANAGEMENT": "Management",
  },
  "zh-Hans": {
    "MAIN_TITLE": "简单词典",
    "SEARCH": "搜索",
    "SEARCH_WEB": "搜索网页",
    "MANAGEMENT": "词典管理",
  }
};

const manager = $objc("DUDictionaryManager").$assetManager();
const textChecker = $objc("UITextChecker").$new();
const languages = $objc("NSLocale").$preferredLanguages();

var definitions = [];
var timer = null;

$ui.render({
  props: {
    title: $l10n("MAIN_TITLE"),
    navButtons: [
      {
        icon: "002",
        handler: async() => {
          $("input").blur();
          await $wait(0.1);
          let vc = $objc("_UIRemoteDictionaryViewController").$alloc().$initWithStyle(0);
          vc.$setTitle($l10n("MANAGEMENT"));
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
        font: $font(17),
        placeholder: $l10n("SEARCH")
      },
      layout: (make, view) => {
        make.left.top.right.inset(10);
        make.height.equalTo(36);
      },
      events: {
        ready: sender => sender.focus(),
        changed: sender => {

          if (timer) {
            timer.cancel();
            timer = null;
          }

          timer = setTimeout(() => {
            searchText(sender.text);
          }, 100);
        }
      }
    },
    {
      type: "list",
      props: {
        id: "result-list",
        rowHeight: 50,
        keyboardDismissMode: 1,
        template: {
          views: [
            {
              type: "label",
              props: {
                id: "term-label",
                textColor: $color("black"),
                font: $font(15, "medium")
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.top.inset(2);
                make.height.equalTo(25);
              }
            },
            {
              type: "label",
              props: {
                id: "result-label",
                textColor: $color("darkGray"),
                font: $font(15)
              },
              layout: (make, view) => {
                make.left.right.inset(15);
                make.bottom.inset(2);
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
        didSelect: async(sender, indexPath) => {
          $("input").blur();
          await $wait(0.1);
          let index = indexPath.row;
          let definition = definitions[index];
          showDefinition(definition);
        }
      }
    }
  ]
});

function searchText(text) {

  function query(term) {
    let results = [];
    let values = manager.$__definitionValuesForTerm(term);
    for (var idx=0; idx<values.$count(); ++idx) {
      let value = values.$objectAtIndex(idx);
      results.push(value);
    }
    return results;
  }

  var results = query(text);
  let range = {"location": 0, "length": text.length};
  let fuzzy = [];

  for (var i=0; i<languages.$count(); ++i) {

    let language = languages.$objectAtIndex(i);
    let guesses = textChecker.$guessesForWordRange_inString_language(range, text, language);
    let completions = textChecker.$completionsForPartialWordRange_inString_language(range, text, language);

    for (var j=0; j<Math.min(6, completions.$count()); ++j) {
      let completion = completions.$objectAtIndex(j);
      fuzzy.push(completion.rawValue());
    }

    for (var k=0; k<Math.min(3, guesses.$count()); ++k) {
      let guess = guesses.$objectAtIndex(k);
      fuzzy.push(guess.rawValue());
    }
  }

  fuzzy.forEach(item => {
    results = results.concat(query(item));
  });

  definitions = [];
  $("result-list").data = results.map(result => {

    let elements = result.$definitionElements().rawValue();
    let senses = (elements["DCSTextElementKeySenses"] || []).join(", ");
    let pos = elements["DCSTextElementKeyPartOfSpeech"];
    let term = result.$term().rawValue();

    if (senses.length == 0) {
      return null;
    }

    definitions.push(result);
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

function showDefinition(definition) {
  
  let title = definition.$term().rawValue();
  let body = definition.$longDefinition().rawValue();

  $ui.push({
    props: {
      title: title,
      navButtons: [
        {
          title: $l10n("SEARCH_WEB"),
          handler: () => {
            $app.openURL(`x-web-search://?${encodeURIComponent(title)}`);
          }
        }
      ]
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
            <body>${body}</body>
          </html>
          `
        },
        layout: $layout.fill
      }
    ]
  });
}