var gba;

try {
  gba = new GameBoyAdvance();
  gba.keypad.eatInput = true;
  gba.setLogger(error => {
    console.log(error);
    gba.pause();

    let screen = document.getElementById("screen");
    if (screen.getAttribute("class") == "dead") {
      console.log("We appear to have crashed multiple times without reseting.");
      return;
    }
    
    let crash = document.createElement("img");
    crash.setAttribute("id", "crash");
    crash.setAttribute("src", "./resources/crash.png");
    screen.parentElement.insertBefore(crash, screen);
    screen.setAttribute("class", "dead");
  });
} catch (exception) {
  gba = null;
}

const KEY_MAP = {
  "L": [gba.keypad.LEFT],
  "R": [gba.keypad.RIGHT],
  "$L": [gba.keypad.L],
  "$R": [gba.keypad.R],
  "U": [gba.keypad.UP],
  "D": [gba.keypad.DOWN],
  "LU": [gba.keypad.LEFT, gba.keypad.UP],
  "RU": [gba.keypad.RIGHT, gba.keypad.UP],
  "LD": [gba.keypad.LEFT, gba.keypad.DOWN],
  "RD": [gba.keypad.RIGHT, gba.keypad.DOWN],
  "B": [gba.keypad.B],
  "A": [gba.keypad.A],
  "BA": [gba.keypad.B, gba.keypad.A],
  "SELECT": [gba.keypad.SELECT],
  "START": [gba.keypad.START]
};

window.onload = () => {
  let canvas = document.getElementById("screen");
  gba.setCanvas(canvas);
  gba.logLevel = gba.LOG_ERROR;

  loadRom("./resources/bios.bin", bios => {
    gba.setBios(bios);
  });
};

function gba_load_url(url) {
  loadFile(url);
}

function gba_load_game() {
  resumeAudio();
  resizeCanvas();
  gba.audio.masterEnable = soundEnabled;
}

function gba_key_down(id) {
  let keys = KEY_MAP[id];
  keys.forEach(key => (gba.keypad.currentDown &= ~(1 << key)));
}

function gba_key_up(id) {
  let keys = KEY_MAP[id];
  keys.forEach(key => (gba.keypad.currentDown |= 1 << key));
}

function gba_reset_keys(id) {
  let keys = [gba.keypad.LEFT, gba.keypad.RIGHT, gba.keypad.UP, gba.keypad.DOWN];

  keys.forEach(key => (gba.keypad.currentDown |= 1 << key));
}

function gba_dump_state() {
  return null;
}

function gba_set_state(state) {

}

function loadFile(path) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", path);
  xhr.responseType = "arraybuffer";

  xhr.onerror = () => {
    console.log(`Error loading ${path}: ${xhr.statusText}`);
  };

  xhr.onload = () => {
    switch (xhr.status) {
      case 200: {
        gba.setRom(xhr.response);
        gba.runStable();
        setTimeout(() => {
          $notify("didLoadRom");
        }, 800);
      } break;
      case 0: break;
      default: xhr.onerror(); break;
    }
  };

  xhr.send();
}

function suspendAudio() {
  if (gba.audio.context) {
    gba.audio.context.suspend();
  }
}

function resumeAudio() {
  if (gba.audio.context) {
    gba.audio.context.resume();
  }
}

document.addEventListener("mousedown", () => resumeAudio());