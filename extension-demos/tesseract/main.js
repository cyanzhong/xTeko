// Create a server
let port = 6060;
let baseURI = `http://localhost:${port}/`;
let server = $server.new();

// Observe events
server.listen({
  didStart: server => $("webView").url = `${baseURI}index.html`
});

// Create a handler
let handler = {};

// Handler filter
handler.filter = rules => {
  return "file";
}

// Handler response
handler.response = request => {

  let method = request.method;
  let url = request.url;
  let pathName = url.substring(url.indexOf(baseURI) + baseURI.length);
  let filePath = `www/${pathName}`;

  if (!$file.exists(filePath)) {
    $ui.alert(`Missing: ${pathName}`);
    return null;
  }

  let isHtml = url.endsWith("html");
  let contentType = isHtml ? "text/html" : "application/javascript";

  return {
    type: "file",
    props: {
      path: filePath,
      contentType: contentType
    }
  };
}

// Register handler
server.addHandler(handler);

// Options
let options = {
  port: port,
  // bonjourName, bonjourType...
};

// Start the server
server.start(options);

async function selectImage() {

  let option = await $ui.menu(["Photos", "Camera"]);
  let selected = option.index == 0 ? await $photo.pick() : await $photo.take();

  if (selected == null) {
    return;
  }

  let image = selected.image;
  let size = image.size;
  let maxSize = 1500;

  if (size.width > maxSize) {
    image = image.resized($size(maxSize, size.height / (size.width / maxSize)));
  }

  if (size.height > maxSize) {
    image = image.resized($size(size.width / (size.height / maxSize), maxSize));
  }

  let jpeg = image.jpg(0.8);
  let dataURI = `data:image/jpeg;base64,${$text.base64Encode(jpeg)}`;
  let language = $cache.get("recognize-language") || "eng";

  $ui.loading(true);
  await $("webView").eval(`recognize('${dataURI}', '${language}')`);
}

$ui.render({
  props: {
    title: "Tesseract",
    navButtons: [
      {
        title: "Languages",
        handler: () => {
          let downloader = require("./scripts/data-downloader");
          downloader.show();
        }
      }
    ]
  },
  views: [
    {
      type: "web",
      props: {
        id: "webView",
        hidden: true
      },
      events: {
        didRecognize: text => {
          $("textView").text = text;
          $ui.loading(false);
        }
      }
    },
    {
      type: "text",
      props: {
        id: "textView",
        bgcolor: $color("background"),
        smoothRadius: 8
      },
      layout: (make, view) => {
        make.left.top.right.inset(10);
        make.height.equalTo(220);
      }
    },
    {
      type: "button",
      props: {
        title: "Select Image",
        smoothRadius: 8
      },
      layout: (make, view) => {
        make.top.equalTo($("textView").bottom).offset(10);
        make.left.right.inset(10);
        make.height.equalTo(36);
      },
      events: {
        tapped: selectImage
      }
    }
  ]
});

selectImage();