const constants = require("./constants");
const storage = require("./storage");
const handlers = require("../handlers");
const server = $server.new();

let port = null;
let options = null;
let baseURI = null;
let siteName = null;

reset();
server.addHandler({
  filter: rules => {
    const url = rules.url.split("?")[0];
    const name = getName(url);
    const {handler, subPath} = getHandler(url);

    if (handler) {
      const result = handler.filter(rules, subPath);
      if (result) {
        return result;
      }
    }

    return "data";
  },
  response: request => {
    const url = request.url.split("?")[0];
    const name = getName(url);
    const {handler, subPath} = getHandler(url);

    if (handler) {
      const result = handler.response(request, subPath);
      if (result) {
        return result;
      }
    }

    const path = `${constants.sitesFolder}/${decodeURIComponent(name)}`;
    if ($file.exists(path)) {
      return {
        type: "file",
        props: {
          path: path
        }
      }
    } else {
      console.error(`[404]: ${path}`);
      return {
        type: "default",
        props: {
          statusCode: 404
        }
      }
    }
  }
});

server.start(options);
$app.listen({"resume": reset});

function reset() {
  port = storage.port();
  options = {"port": port};
  baseURI = `http://${constants.host}:${port}/`;

  if (server.running) {
    server.stop();
    server.start(options);
  }
}

exports.reset = reset;

exports.setSiteName = name => {
  siteName = encodeURIComponent(name);
}

function getName(url) {
  const name = url.substring(url.indexOf(baseURI) + baseURI.length);
  if (name.startsWith(siteName)) {
    return name;
  } else {
    return `${siteName}/${name}`;
  }
}

function getHandler(url) {
  const name = getName(url);
  const path = `${constants.sitesFolder}/${decodeURIComponent(name)}`;
  const site = name.split("/")[0];
  const handler = handlers[decodeURIComponent(site)];
  return {
    handler: handler,
    subPath: path.substring(constants.sitesFolder.length + site.length + 1)
  };
}