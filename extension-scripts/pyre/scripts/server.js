const constants = require("./constants");

exports.init = callback => {
  const port = constants.port;
  const options = {"port": port};
  const baseURI = `http://localhost:${port}/`;
  const server = $server.new();

  server.listen({
    didStart: callback
  });

  server.addHandler({
    response: request => {
      let url = request.url;
      let name = url.substring(url.indexOf(baseURI) + baseURI.length);

      if (name.includes("?")) {
        name = name.split("?")[0];
      }

      let folder = name.includes(".py") ? "modules" : "www";
      let path = `${folder}/${decodeURIComponent(name)}`;

      return {
        type: "file",
        props: {
          path: path
        }
      }
    }
  });
  
  server.start(options);
}