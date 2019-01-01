module.exports = function(name) {

  let path = `scripts/data/${name}.js`;
  let options = $file.read(path).string;

  $ui.push({
    views: [
      {
        type: "chart",
        props: {
          options: options
        },
        layout: (make, view) => {
          make.edges.equalTo(view.super.safeArea);
        },
        events: {
          finished: () => {
            console.log("finished");
          }
        }
      }
    ]
  });
};
