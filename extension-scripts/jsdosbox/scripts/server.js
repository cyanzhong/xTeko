const constants = require("./constants");
const utility = require("./utility");

exports.init = () => {
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
      utility.setAudioEnabled(false);
    },
    "resume": () => {
      utility.setAudioEnabled(true);
      server.stop();
      server.start(options);
    },
    "exit": () => {
      utility.destroyDosBox();
    }
  });
}