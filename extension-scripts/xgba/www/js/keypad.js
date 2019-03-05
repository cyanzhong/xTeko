function GameBoyAdvanceKeypad() {
	this.KEYCODE_LEFT = 37;
	this.KEYCODE_UP = 38;
	this.KEYCODE_RIGHT = 39;
	this.KEYCODE_DOWN = 40;
	this.KEYCODE_START = 13;
	this.KEYCODE_SELECT = 220;
	this.KEYCODE_A = 90;
	this.KEYCODE_B = 88;
	this.KEYCODE_L = 65;
	this.KEYCODE_R = 83;

	this.GAMEPAD_LEFT = 14;
	this.GAMEPAD_UP = 12;
	this.GAMEPAD_RIGHT = 15;
	this.GAMEPAD_DOWN = 13;
	this.GAMEPAD_START = 9;
	this.GAMEPAD_SELECT = 8;
	this.GAMEPAD_A = 1;
	this.GAMEPAD_B = 0;
	this.GAMEPAD_L = 4;
	this.GAMEPAD_R = 5;
	this.GAMEPAD_THRESHOLD = 0.2;

	this.A = 0;
	this.B = 1;
	this.SELECT = 2;
	this.START = 3;
	this.RIGHT = 4;
	this.LEFT = 5;
	this.UP = 6;
	this.DOWN = 7;
	this.R = 8;
	this.L = 9;

	this.currentDown = 0x03FF;
	this.eatInput = false;
};

GameBoyAdvanceKeypad.prototype.keyboardHandler = function(e) {
	var toggle = 0;
	switch (e.keyCode) {
	case this.KEYCODE_START:
		toggle = this.START;
		break;
	case this.KEYCODE_SELECT:
		toggle = this.SELECT;
		break;
	case this.KEYCODE_A:
		toggle = this.A;
		break;
	case this.KEYCODE_B:
		toggle = this.B;
		break;
	case this.KEYCODE_L:
		toggle = this.L;
		break;
	case this.KEYCODE_R:
		toggle = this.R;
		break;
	case this.KEYCODE_UP:
		toggle = this.UP;
		break;
	case this.KEYCODE_RIGHT:
		toggle = this.RIGHT;
		break;
	case this.KEYCODE_DOWN:
		toggle = this.DOWN;
		break;
	case this.KEYCODE_LEFT:
		toggle = this.LEFT;
		break;
	default:
		return;
	}

	toggle = 1 << toggle;
	if (e.type == "keydown") {
		this.currentDown &= ~toggle;
	} else {
		this.currentDown |= toggle;
	}

	if (this.eatInput) {
		e.preventDefault();
	}
};

GameBoyAdvanceKeypad.prototype.gamepadHandler = function(gamepad) {
	var value = 0;
	if (gamepad.buttons[this.GAMEPAD_LEFT] > this.GAMEPAD_THRESHOLD) {
		value |= 1 << this.GAMEPAD_LEFT;
	}
	if (gamepad.buttons[this.GAMEPAD_UP] > this.GAMEPAD_THRESHOLD) {
		value |= 1 << this.GAMEPAD_UP;
	}
	if (gamepad.buttons[this.GAMEPAD_RIGHT] > this.GAMEPAD_THRESHOLD) {
		value |= 1 << this.GAMEPAD_RIGHT;
	}
	if (gamepad.buttons[this.GAMEPAD_DOWN] > this.GAMEPAD_THRESHOLD) {
		value |= 1 << this.GAMEPAD_DOWN;
	}
	if (gamepad.buttons[this.GAMEPAD_START] > this.GAMEPAD_THRESHOLD) {
		value |= 1 << this.GAMEPAD_START;
	}
	if (gamepad.buttons[this.GAMEPAD_SELECT] > this.GAMEPAD_THRESHOLD) {
		value |= 1 << this.GAMEPAD_SELECT;
	}
	if (gamepad.buttons[this.GAMEPAD_A] > this.GAMEPAD_THRESHOLD) {
		value |= 1 << this.GAMEPAD_A;
	}
	if (gamepad.buttons[this.GAMEPAD_B] > this.GAMEPAD_THRESHOLD) {
		value |= 1 << this.GAMEPAD_B;
	}
	if (gamepad.buttons[this.GAMEPAD_L] > this.GAMEPAD_THRESHOLD) {
		value |= 1 << this.GAMEPAD_L;
	}
	if (gamepad.buttons[this.GAMEPAD_R] > this.GAMEPAD_THRESHOLD) {
		value |= 1 << this.GAMEPAD_R;
	}

	this.currentDown = ~value & 0x3FF;
};

GameBoyAdvanceKeypad.prototype.pollGamepads = function() {
	if (navigator.webkitGetGamepads) {
		var gamepads = navigator.webkitGetGamepads();
		if (gamepads.length > 0) {
			this.gamepadHandler(gamepads[0]);
		}
	}
};

GameBoyAdvanceKeypad.prototype.registerHandlers = function() {
	window.addEventListener("keydown", this.keyboardHandler.bind(this), true);
	window.addEventListener("keyup", this.keyboardHandler.bind(this), true);
};
