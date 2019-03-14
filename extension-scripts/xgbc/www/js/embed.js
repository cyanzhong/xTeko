const KEY_MAP = {
  "L": ["left"],
  "R": ["right"],
  "U": ["up"],
  "D": ["down"],
  "LU": ["left", "up"],
  "RU": ["right", "up"],
  "LD": ["left", "down"],
  "RD": ["right", "down"],
  "B": ["b"],
  "A": ["a"],
  "BA": ["b", "a"],
  "SELECT": ["select"],
  "START": ["start"],
};

function gbc_load_url(url) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.overrideMimeType("text/plain; charset=x-user-defined");

  xhr.onerror = () => {
    console.log(`Error loading ${path}: ${xhr.statusText}`);
  };

  xhr.onload = () => {
    switch (xhr.status) {
      case 200: {
        let canvas = document.getElementById("mainCanvas");
        resizeCanvas();
        initPlayer();
        start(canvas, xhr.responseText);
        pause();
      } break;
      case 0: break;
      default: xhr.onerror(); break;
    }
  };

  xhr.send();
}

function gbc_load_game() {
  run();
  settings[0] = soundEnabled;
}

function gbc_key_down(id) {
  let keys = KEY_MAP[id];
  keys.forEach(key => GameBoyKeyDown(key));
}

function gbc_key_up(id) {
  let keys = KEY_MAP[id];
  keys.forEach(key => GameBoyKeyUp(key));
}

function gbc_reset_keys() {
  let keys = [
    "left",
    "right",
    "up",
    "down",
  ];
  keys.forEach(key => GameBoyKeyUp(key));
}

function gbc_dump_state() {
  return gameboy.saveState();
}

function gbc_set_state(state) {
  gameboy.returnFromState(state);
}

function gbc_set_audio_enabled(enabled) {
  if (XAudioJSWebAudioContextHandle) {
    if (enabled) {
      XAudioJSWebAudioContextHandle.resume();
    } else {
      XAudioJSWebAudioContextHandle.suspend();
    }
  }
}

document.addEventListener("mousedown", () => {
  if (XAudioJSWebAudioContextHandle) {
    XAudioJSWebAudioContextHandle.resume();
  }
});