const dispatcher = require("./dispatcher");

$define({
  type: "UIResponder",
  events: {
    "_keyCommandForEvent:": evt => {
      let isKeyDown = evt.$__isKeyDown();
      let name = isKeyDown ? "keyDown" : "keyUp";
      let code = evt.$__keyCode();
      let key = getKey(code);

      if (key) {
        isKeyDown ? dispatcher.$keyDown_taptic(key, false) : dispatcher.$keyUp(key);
      }

      if ($app.notify) {
        $app.notify({
          name: name,
          object: code
        });
      }

      return self.$ORIG__keyCommandForEvent(evt);
    } 
  }
});

function getKey(code) {
  const {mapper} = require("./key-settings");
  let key = mapper[code];
  return key;
}