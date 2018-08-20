var socket = $socket.new("wss://echo.websocket.org");

$ui.render({
  props: {
    title: "Web Socket"
  },
  views: [
    {
      type: "button",
      props: {
        title: "Send"
      },
      layout: (make, view) => {
        make.top.right.inset(10);
        make.size.equalTo($size(80, 36));
      }
    },
    {
      type: "input",
      props: {
        placeholder: "Message"
      },
      layout: (make, view) => {
        make.top.left.inset(10);
        make.right.inset(100);
        make.height.equalTo(36);
      },
      events: {
        ready: (sender) => {
          sender.focus();
        },
        returned: (sender) => {
          var text = sender.text;
          sender.text = "";
          sendMessage(text);
        }
      }
    },
    {
      type: "text",
      props: {
        id: "message-view",
        editable: false,
        bgcolor: $color("background"),
        radius: 5
      },
      layout: (make, view) => {
        make.left.right.inset(10);
        make.top.equalTo(56);
        make.height.equalTo(150);
      }
    }
  ]
});

function showMessage(message) {
  console.log(message);

  var messageView = $("message-view");
  messageView.text = `${message}\n${messageView.text}`;
}

function sendMessage(message) {
  socket.send(message);
  showMessage(`Sent: ${message}`);
}

var events = {};

events.didOpen = (sock) => {
  showMessage("Websocket Connected");
}

events.didFail = (sock, error) => {
  showMessage(`:( Websocket Failed With Error: ${error}`);
}

events.didClose = (sock, code, reason, wasClean) => {
  showMessage("WebSocket closed");
}

events.didReceiveString = (sock, string) => {
  showMessage(`Received: ${string}`);
}

events.didReceivePing = (sock, data) => {
  showMessage("WebSocket received ping");
}

events.didReceivePong = (sock, data) => {
  showMessage("WebSocket received pong");
}

socket.listen(events);
socket.open();

showMessage("Connecting...");