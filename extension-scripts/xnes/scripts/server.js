const constants = require("./constants");
const dispatcher = require("./dispatcher");

exports.init = cb => {
  const port = constants.port;
  const options = {"port": port};
  const baseURI = `http://localhost:${port}/`;
  const server = $server.new();

  server.addHandler({
    response: request => {
      let url = request.url;
      let name = url.substring(url.indexOf(baseURI) + baseURI.length);
      let path = `www/${decodeURIComponent(name)}`;
      return {
        type: "file",
        props: {
          path: path
        }
      }
    }
  });
  
  server.start(options);

  $app.listen({
    "pause": () => {
      dispatcher.$evaluate("setAudioEnabled(false)");
    },
    "resume": () => {
      server.stop();
      server.start(options);
      dispatcher.$evaluate("setAudioEnabled(true)");
    }
  });
}