const axisValues = [
  $stackViewAxis.horizontal,
  $stackViewAxis.vertical,
];

const distributionValues = [
  $stackViewDistribution.fill,
  $stackViewDistribution.fillEqually,
  $stackViewDistribution.fillProportionally,
  $stackViewDistribution.equalSpacing,
  $stackViewDistribution.equalCentering,
];

const alignmentValues = [
  $stackViewAlignment.fill,
  $stackViewAlignment.leading,
  $stackViewAlignment.top,
  $stackViewAlignment.firstBaseline,
  $stackViewAlignment.center,
  $stackViewAlignment.trailing,
  $stackViewAlignment.bottom,
  $stackViewAlignment.lastBaseline,
];

$ui.render({
  props: {
    title: "Stack View",
    navButtons: [
      {
        title: "Properties",
        handler: () => {
          $prefs.open();
        }
      }
    ]
  },
  views: [
    {
      type: "stack",
      props: {
        id: "stack-view",
        stack: {
          views: [
            {
              type: "label",
              props: {
                text: "View 1",
                align: $align.center,
                bgcolor: $rgba(0, 0, 0, 0.15)
              }
            },
            {
              type: "label",
              props: {
                text: "View 2",
                align: $align.center,
                bgcolor: $rgba(0, 0, 0, 0.25)
              }
            },
            {
              type: "label",
              props: {
                text: "View 3",
                align: $align.center,
                bgcolor: $rgba(0, 0, 0, 0.35)
              }
            }
          ]
        }
      },
      layout: $layout.fill
    }
  ],
  events: {
    appeared: layoutViews
  }
});

function layoutViews() {
  const stackView = $("stack-view");
  if (stackView == null) {
    return;
  }

  stackView.axis = $prefs.get("demo.stack.axis");
  stackView.distribution = $prefs.get("demo.stack.distribution");
  stackView.alignment = $prefs.get("demo.stack.alignment");
  stackView.spacing = $prefs.get("demo.stack.spacing");
  stackView.baselineRelative = $prefs.get("demo.stack.baselineRelative");
  stackView.layoutMarginsRelative = $prefs.get("demo.stack.layoutMarginsRelative");
}

layoutViews();