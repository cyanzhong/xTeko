// Create a server
let port = 6060;
let server = $server.new();

// Observe events
server.listen({
  didStart: server => {
    $ui.render({
      views: [
        {
          type: "web",
          props: {
            url: `http://localhost:${port}/index.html`
          },
          layout: $layout.fill
        }
      ]
    });
  }
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
  let isHtml = url.endsWith("html");
  let filePath = isHtml ? "index.html" : "tesseract.js";
  let contentType = isHtml ? "text/html" : "application/javascript";

  return {
    type: "file",
    props: {
      path: `assets/${filePath}`,
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