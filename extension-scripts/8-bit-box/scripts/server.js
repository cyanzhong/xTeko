exports.init = cb => {
  const port = 1010;
  const options = {"port": port};
  const baseURI = `http://localhost:${port}/`;
  const server = $server.new();

  server.addHandler({
    response: request => {
      let url = request.url;
      let name = url.substring(url.indexOf(baseURI) + baseURI.length);
      let path = `www/${name}`;
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