// Create a server
var port = 6060;
var server = $server.new();

// Observe events
server.listen({
  didStart: server => {
    $delay(1, () => {
      $app.openURL(`http://localhost:${port}`);
    });
  },
  didConnect: server => {},
  didDisconnect: server => {},
  didStop: server => {},
  didCompleteBonjourRegistration: server => {},
  didUpdateNATPortMapping: server => {}
});

// Create a handler
var handler = {};

// Handler filter
handler.filter = rules => {
  var method = rules.method;
  var url = rules.url;
  console.log(rules);
  // rules.headers, rules.path, rules.query;
  return "data"; // default, data, file, multipart, urlencoded
}

// Handler response
handler.response = request => {

  var method = request.method;
  var url = request.url;

  console.log(`${method}: ${url}`);

  return {
    type: "data", // default, data, file, error
    props: {
      html: "<html><body style='font-size: 300px'>Hello!</body></html>"
      // json: {
      //   "status": 1,
      //   "values": ["a", "b", "c"]
      // }
    }
  };
}

// Register handler
server.addHandler(handler);

// Options
var options = {
  port: port,
  // bonjourName, bonjourType...
};

// Start the server
server.start(options);