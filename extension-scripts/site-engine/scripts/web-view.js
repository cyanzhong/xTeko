const storage = require("./storage");

exports.open = (site, url) => {
  $ui.push({
    props: {
      title: site,
      navBarHidden: storage.fullScreen(),
      clipsToSafeArea: storage.safeArea()
    },
    views: [
      {
        type: "web",
        props: {
          url: url,
          toolbar: storage.showToolbar(),
          showsProgress: storage.showProgress(),
          scrollEnabled: !storage.disableScrolling(),
          ua: storage.userAgent()
        },
        layout: $layout.fill
      }
    ]
  });
}