const rates = [0.12, 0.15, 0.18, 0.2];

$app.theme = "auto";

$ui.render({
  props: {
    title: "Tip Calculator"
  },
  views: [
    {
      type: "input",
      props: {
        type: $kbType.decimal
      },
      layout({left, size}) {
        left.top.equalTo(10);
        size.equalTo($size(128, 32));
      },
      events: {
        ready(sender) {
          sender.focus();
        },
        changed(sender) {
          calculate();
        }
      }
    },
    {
      type: "label",
      props: {
        font: $font("bold", 20),
        align: $align.center,
        lines: 2
      },
      layout({centerY, right, left}) {
        centerY.equalTo($("input"));
        right.inset(10);
        left.equalTo($("input").right).offset(10);
      }
    },
    {
      type: "tab",
      props: {
        items: rates.map(item => `${item * 100}%`)
      },
      layout({left, top}) {
        left.right.inset(10);
        top.equalTo($("input").bottom).offset(10);
      },
      events: {
        changed(sender) {
          calculate();
        }
      }
    }
  ]
});

function calculate() {
  const origin = Number($("input").text);
  const rate = rates[$("tab").index];
  const tip = origin * rate;
  $("label").text =
    `${origin.toFixed(2)} + ${tip.toFixed(2)} = ${(origin + tip).toFixed(2)}`;
}