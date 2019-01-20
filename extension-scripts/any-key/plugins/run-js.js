let helper = require("scripts/helper");
let text = await helper.getAllText();
let result = "";

try {
  result += eval(text);
} catch(error) {
  
}

$ui.push({
  props: {
    title: "JavaScript"
  },
  views: [
    {
      type: "button",
      props: {
        title: $l10n("INSERT")
      },
      layout: (make, view) => {
        make.height.equalTo(36);
        make.left.bottom.right.inset(10);
      },
      events: {
        tapped: () => {
          $keyboard.insert(result);
          $ui.pop();
        }
      }
    },
    {
      type: "label",
      props: {
        font: $font("medium", 24),
        text: result,
        lines: 0,
        align: $align.center,
        textColor: $color("black")
      },
      layout: (make, view) => {
        make.left.top.right.inset(10);
        make.bottom.equalTo($("button").top).offset(-10);
      }
    }
  ]
});