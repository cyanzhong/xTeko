const rates = [0.12, 0.15, 0.18, 0.2];

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
      layout: function(make) {
        make.left.top.equalTo(10);
        make.size.equalTo($size(128, 32));
      },
      events: {
        ready: function(sender) {
          sender.focus();
        },
        changed: function(sender) {
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
      layout: function(make) {
        make.centerY.equalTo($("input"));
        make.right.inset(10);
        make.left.equalTo($("input").right).offset(10);
      }
    },
    {
      type: "tab",
      props: {
        items: rates.map(function(item) {
          return item * 100 + "%";
        })
      },
      layout: function(make) {
        make.left.right.inset(10);
        make.top.equalTo($("input").bottom).offset(10);
      },
      events: {
        changed: function(sender) {
          calculate();
        }
      }
    }
  ]
});

function calculate() {
  var origin = Number($("input").text);
  var rate = rates[$("tab").index];
  var tip = origin * rate;
  $("label").text =
    origin.toFixed(2) +
    " + " +
    tip.toFixed(2) +
    " = " +
    (origin + tip).toFixed(2);
}