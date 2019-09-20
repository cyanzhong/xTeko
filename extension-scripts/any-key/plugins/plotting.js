let helper = require("scripts/helper");
let text = await helper.getAllText();
let lines = text.split("\n");

var names = [];
var values = [];

for (const line of lines) {
  let components = line.split(/[\s,:]+/);
  if (components.length != 2) {
    continue;
  }

  let name = components[0];
  let value = parseFloat(components[1]);

  names.push(name);
  values.push(value);
}

let options = {
  xAxis: {
    type: "category",
    data: names
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      type: "bar",
      data: values
    }
  ]
};

$ui.push({
  props: {
    title: $l10n("Plotting")
  },
  views: [
    {
      type: "chart",
      props: {
        options: options
      },
      layout: $layout.fill
    }
  ]
});