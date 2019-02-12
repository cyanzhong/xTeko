let port = 7070;
let baseURI = `http://localhost:${port}/`;
let server = $server.new();
let handler = {};

handler.filter = rules => {
  return "file";
}

handler.response = request => {
  
  let url = request.url;
  let pathName = url.substring(url.indexOf(baseURI) + baseURI.length);
  let filePath = `www/${pathName}`;

  if (!$file.exists(filePath)) {
    $ui.alert(`Missing: ${pathName}`);
    return null;
  }

  let fileExt = filePath.split(".").pop();
  let contentTypes = {
    "png": "image/png",
    "html": "text/html",
    "js": "application/javascript",
  }

  return {
    type: "file",
    props: {
      path: filePath,
      contentType: contentTypes[fileExt]
    }
  }
}

server.addHandler(handler);
server.start({"port": port});

$ui.render({
  props: {
    title: "Emoji Mosaic",
    clipsToSafeArea: true
  },
  views: [
    {
      type: "markdown",
      props: {
        id: "readme",
        content: $file.read($l10n("README_FILE")).string
      },
      layout: $layout.fill
    },
    {
      type: "web",
      props: {
        id: "webView",
        hidden: true
      },
      layout: (make, view) => {
        make.left.top.right.equalTo(0);
        make.bottom.inset(56);
      },
      events: {
        didFinishRender: () => {
          $ui.animate({
            duration: 0.4,
            animation: () => {
              $("share-btn").alpha = 1;
              $("import-btn").alpha = 1;
            }
          });
        }
      }
    },
    {
      type: "button",
      props: {
        id: "share-btn",
        title: $l10n("SHARE"),
        alpha: 0
      },
      layout: (make, view) => {
        make.left.inset(32);
        make.width.equalTo(view.super).multipliedBy(0.5).offset(-38);
        make.bottom.inset(10);
        make.height.equalTo(36);
      },
      events: {
        tapped: async() => {
          let uri = (await $("webView").eval("exportImage()"))[0];
          let data = $data({"base64": uri});
          $share.sheet(data);
        }
      }
    },
    {
      type: "button",
      props: {
        id: "import-btn",
        title: $l10n("IMPORT"),
        alpha: 0
      },
      layout: (make, view) => {
        make.right.inset(32);
        make.width.equalTo(view.super).multipliedBy(0.5).offset(-38);
        make.bottom.inset(10);
        make.height.equalTo(36);
      },
      events: {
        tapped: selectImage
      }
    }
  ]
});

async function selectImage() {

  let option = await $ui.menu([$l10n("PHOTOS"), $l10n("CAMERA")]);
  if (option == null) {
    return;
  }

  let selected = option.index == 0 ? await $photo.pick() : await $photo.take();
  if (selected == null || selected.image == null) {
    return;
  }

  $file.write({
    "data": selected.image.orientationFixedImage.jpg(0.8),
    "path": "www/image.jpeg"
  });

  $("webView").url = `${baseURI}index.html`;
  $("webView").hidden = false;
  $("readme").hidden = true;
}

selectImage();