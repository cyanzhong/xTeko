window.AudioContext = (() => {
  return window.webkitAudioContext || window.AudioContext || window.mozAudioContext;
})();

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
const FRAMEBUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT;

const KEY_MAP = {
  "L": [jsnes.Controller.BUTTON_LEFT],
  "R": [jsnes.Controller.BUTTON_RIGHT],
  "U": [jsnes.Controller.BUTTON_UP],
  "D": [jsnes.Controller.BUTTON_DOWN],
  "LU": [jsnes.Controller.BUTTON_LEFT, jsnes.Controller.BUTTON_UP],
  "RU": [jsnes.Controller.BUTTON_RIGHT, jsnes.Controller.BUTTON_UP],
  "LD": [jsnes.Controller.BUTTON_LEFT, jsnes.Controller.BUTTON_DOWN],
  "RD": [jsnes.Controller.BUTTON_RIGHT, jsnes.Controller.BUTTON_DOWN],
  "B": [jsnes.Controller.BUTTON_B],
  "A": [jsnes.Controller.BUTTON_A],
  "BA": [jsnes.Controller.BUTTON_A, jsnes.Controller.BUTTON_B],
  "SELECT": [jsnes.Controller.BUTTON_SELECT],
  "START": [jsnes.Controller.BUTTON_START],
};

var canvas_ctx;
var image;
var framebuffer_u8;
var framebuffer_u32;

this.props = {
  paused: false
};

this.bufferSize = 8192;
this.buffer = new RingBuffer(this.bufferSize * 2);

let speaker = {
  start: () => {
    this.audioCtx = new window.AudioContext();
    this.scriptNode = this.audioCtx.createScriptProcessor(1024, 0, 2);
    this.scriptNode.onaudioprocess = this.onAudioProcess;
    this.scriptNode.connect(this.audioCtx.destination);
  },
  stop: () => {
    if (this.scriptNode) {
      this.scriptNode.disconnect(this.audioCtx.destination);
      this.scriptNode.onaudioprocess = null;
      this.scriptNode = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  },
  writeSample: (left, right) => {
    this.buffer.enq(left);
    this.buffer.enq(right);
  }
};

speaker.start();

let nes = new jsnes.NES({
  onFrame: framebuffer_24 => {
    for (var i = 0; i < FRAMEBUFFER_SIZE; i++) {
      framebuffer_u32[i] = 0xff000000 | framebuffer_24[i];
    }
  },
  onAudioSample: speaker.writeSample
});

function nes_keydown(id) {
  let keys = KEY_MAP[id];
  keys.forEach(key => nes.buttonDown(1, key));
}

function nes_keyup(id) {
  let keys = KEY_MAP[id];
  keys.forEach(key => nes.buttonUp(1, key));
}

function nes_reset_keys() {
  let keys = [
    jsnes.Controller.BUTTON_LEFT,
    jsnes.Controller.BUTTON_RIGHT,
    jsnes.Controller.BUTTON_UP,
    jsnes.Controller.BUTTON_DOWN,
  ];
  keys.forEach(key => nes.buttonUp(1, key));
}

function nes_dump_state() {
  return nes.toJSON();
}

function nes_set_state(state) {
  nes.fromJSON(state);
}

function nes_init(canvas_id) {
  let canvas = document.getElementById(canvas_id);
  canvas_ctx = canvas.getContext("2d");
  image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  canvas_ctx.fillStyle = "black";
  canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  // Allocate framebuffer array.
  let buffer = new ArrayBuffer(image.data.length);
  framebuffer_u8 = new Uint8ClampedArray(buffer);
  framebuffer_u32 = new Uint32Array(buffer);
}

function nes_boot(rom_data) {
  nes.loadROM(rom_data);
  window.requestAnimationFrame(onAnimationFrame);
}

function nes_load_url(canvas_id, path, soundEnabled) {
  nes_init(canvas_id);
  nes.opts.emulateSound = soundEnabled;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", path);
  xhr.overrideMimeType("text/plain; charset=x-user-defined");

  xhr.onerror = () => {
    console.log(`Error loading ${path}: ${xhr.statusText}`);
  };

  xhr.onload = () => {
    switch (xhr.status) {
      case 200:
        nes_boot(xhr.responseText);
        break;
      case 0:
        break;
      default:
        xhr.onerror();
        break;
    }
  };

  xhr.send();
}

function nes_set_audio_enabled(enabled) {
  if (this.audioCtx) {
    if (enabled) {
      this.audioCtx.resume();
    } else {
      this.audioCtx.suspend();
    }
  }
}

function onBufferUnderrun(actualSize, desiredSize) {
  if (!this.nes || props.paused) {
    return;
  }

  this.nes.frame();
  if (buffer.size() < desiredSize) {
    this.nes.frame();
  }
}

function onAudioProcess(event) {
  let left = event.outputBuffer.getChannelData(0);
  let right = event.outputBuffer.getChannelData(1);
  let size = left.length;

  if (buffer.size() < size * 2 && onBufferUnderrun) {
    onBufferUnderrun(buffer.size(), size * 2);
  }

  try {
    var samples = buffer.deqN(size * 2);
  } catch (error) {
    for (var j = 0; j < size; j++) {
      left[j] = 0;
      right[j] = 0;
    }
    return;
  }

  for (var i = 0; i < size; i++) {
    left[i] = samples[i * 2];
    right[i] = samples[i * 2 + 1];
  }
}

function onAnimationFrame() {
  window.requestAnimationFrame(onAnimationFrame);

  image.data.set(framebuffer_u8);
  canvas_ctx.putImageData(image, 0, 0);
  nes.frame();
}

document.addEventListener("mousedown", () => {
  this.audioCtx.resume();
});