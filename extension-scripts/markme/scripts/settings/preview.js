const colors = require("../common/colors");
const storage = require("./storage");

exports.open = (options, title, applied) => {
  const _options = Object.assign({}, {
    theme: storage.theme(),
    font: storage.font(),
    size: storage.fontSize(),
    padding: storage.linePadding(),
  }, options);

  const textView = require("../editor/text-view").new();
  textView.$setStyle(_options.theme);
  textView.$setFontName(_options.font);
  textView.$setFontSize(_options.size);
  textView.$setLinePadding(_options.padding);
  textView.$setEditable(false);
  textView.$setSelectable(false);

  const example = $l10n("EXAMPLE_FILE");
  textView.$render($file.read(example).string);

  $ui.push({
    props: {
      title: title,
      bgcolor: textView.rawValue().bgcolor
    },
    views: [
      {
        type: "runtime",
        props: {
          view: textView
        },
        layout: (make, view) => {
          make.edges.equalTo(view.super.safeArea);
        }
      },
      {
        type: "button",
        props: {
          title: $l10n("APPLY_THEME"),
          bgcolor: colors.blue,
          smoothRadius: 8
        },
        layout: (make, view) => {
          make.left.equalTo(view.super.safeAreaLeft).offset(32);
          make.right.equalTo(view.super.safeAreaRight).offset(-32);
          make.bottom.equalTo(view.super.safeAreaBottom).offset(-10);
          make.height.equalTo(44);
        },
        events: {
          tapped: () => {
            applied();
            const topVC = $ui.controller.runtimeValue();
            const navigationVC = topVC.$navigationController();
            const viewControllers = navigationVC.$viewControllers();
            const destVC = viewControllers.$objectAtIndex(viewControllers.$count() - 3);
            navigationVC.$popToViewController_animated(destVC, true);
          }
        }
      }
    ]
  });
}