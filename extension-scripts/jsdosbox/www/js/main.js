const KEY_MAP = {
  "LEFT": 37,
  "RIGHT": 39,
  "UP": 38,
  "DOWN": 40,
  "ESC": 27,
  "SPACE": 32,
  "ENTER": 13,
  "TAB": 9,
  "F1": 112,
  "F2": 113,
  "F3": 114,
  "F4": 115,
  "F5": 116,
  "F6": 117,
  "F7": 118,
  "F8": 119,
  "F9": 120,
  "F10": 121,
  "F11": 122,
  "F12": 123,
};

function loadGame() {
  document.getElementById("container").style.display = "block";
  document.getElementById("player").style.display = "none";
}

function keyDown(key) {
  _keyEvent(KEY_MAP[key]);
}

function keyUp(key) {
  _keyEvent(KEY_MAP[key], "up");
}

function keyCodeDown(code, shift, ctrl, alt, meta) {
  if (shift) {
    _keyEvent(16);
  }

  if (ctrl) {
    _keyEvent(17);
  }

  if (alt) {
    _keyEvent(18);
  }

  if (meta) {
    _keyEvent(91);
  }

  _keyEvent(code);
}

function keyCodeUp(code, shift, ctrl, alt, meta) {
  _keyEvent(code, "up");

  if (shift) {
    _keyEvent(16, "up");
  }

  if (ctrl) {
    _keyEvent(17, "up");
  }

  if (alt) {
    _keyEvent(18, "up");
  }

  if (meta) {
    _keyEvent(91, "up");
  }
}

function keyCodePress(code, shift, ctrl, alt, meta) {
  keyCodeDown(code, shift, ctrl, alt, meta);
  setTimeout(() => {
    keyCodeUp(code, shift, ctrl, alt, meta);
  }, 100);
}

function _keyEvent(code, type) {
  let name = (typeof(type) === "string") ? "key" + type : "keydown";	
  let event = document.createEvent("HTMLEvents");
  event.initEvent(name, true, false);
  event.keyCode = code;
  document.dispatchEvent(event);
}