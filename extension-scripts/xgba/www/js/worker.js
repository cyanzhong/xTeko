importScripts('software.js');

var video = new GameBoyAdvanceSoftwareRenderer();
var proxyBacking = null;
var currentFrame = 0;

self.finishDraw = function(pixelData) {
	self.postMessage({ type: 'finish', backing: pixelData, frame: currentFrame });
}

function receiveDirty(dirty) {
	for (var type in dirty) {
		switch (type) {
		case 'DISPCNT':
			video.writeDisplayControl(dirty[type]);
			break;
		case 'BGCNT':
			for (var i in dirty[type]) {
				if (typeof(dirty[type][i]) === 'number') {
					video.writeBackgroundControl(i, dirty[type][i]);
				}
			}
			break;
		case 'BGHOFS':
			for (var i in dirty[type]) {
				if (typeof(dirty[type][i]) === 'number') {
					video.writeBackgroundHOffset(i, dirty[type][i]);
				}
			}
			break;
		case 'BGVOFS':
			for (var i in dirty[type]) {
				if (typeof(dirty[type][i]) === 'number') {
					video.writeBackgroundVOffset(i, dirty[type][i]);
				}
			}
			break;
		case 'BGX':
			for (var i in dirty[type]) {
				if (typeof(dirty[type][i]) === 'number') {
					video.writeBackgroundRefX(i, dirty[type][i]);
				}
			}
			break;
		case 'BGY':
			for (var i in dirty[type]) {
				if (typeof(dirty[type][i]) === 'number') {
					video.writeBackgroundRefY(i, dirty[type][i]);
				}
			}
			break;
		case 'BGPA':
			for (var i in dirty[type]) {
				if (typeof(dirty[type][i]) === 'number') {
					video.writeBackgroundParamA(i, dirty[type][i]);
				}
			}
			break;
		case 'BGPB':
			for (var i in dirty[type]) {
				if (typeof(dirty[type][i]) === 'number') {
					video.writeBackgroundParamB(i, dirty[type][i]);
				}
			}
			break;
		case 'BGPC':
			for (var i in dirty[type]) {
				if (typeof(dirty[type][i]) === 'number') {
					video.writeBackgroundParamC(i, dirty[type][i]);
				}
			}
			break;
		case 'BGPD':
			for (var i in dirty[type]) {
				if (typeof(dirty[type][i]) === 'number') {
					video.writeBackgroundParamD(i, dirty[type][i]);
				}
			}
			break;
		case 'WIN0H':
			video.writeWin0H(dirty[type]);
			break;
		case 'WIN1H':
			video.writeWin1H(dirty[type]);
			break;
		case 'WIN0V':
			video.writeWin0V(dirty[type]);
			break;
		case 'WIN1V':
			video.writeWin1V(dirty[type]);
			break;
		case 'WININ':
			video.writeWinIn(dirty[type]);
			break;
		case 'WINOUT':
			video.writeWinOut(dirty[type]);
			break;
		case 'BLDCNT':
			video.writeBlendControl(dirty[type]);
			break;
		case 'BLDALPHA':
			video.writeBlendAlpha(dirty[type]);
			break;
		case 'BLDY':
			video.writeBlendY(dirty[type]);
			break;
		case 'MOSAIC':
			video.writeMosaic(dirty[type]);
			break;
		case 'memory':
			receiveMemory(dirty.memory);
			break;
		}
	}
}

function receiveMemory(memory) {
	if (memory.palette) {
		video.palette.overwrite(new Uint16Array(memory.palette));
	}
	if (memory.oam) {
		video.oam.overwrite(new Uint16Array(memory.oam));
	}
	if (memory.vram) {
		for (var i = 0; i < 12; ++i) {
			if (memory.vram[i]) {
				video.vram.insert(i << 12, new Uint16Array(memory.vram[i]));
			}
		}
	}
}

var handlers = {
	clear: function(data) {
		video.clear(data);
	},

	scanline: function(data) {
		receiveDirty(data.dirty);
		video.drawScanline(data.y, proxyBacking);
	},

	start: function(data) {
		proxyBacking = data.backing;
		video.setBacking(data.backing);
	},

	finish: function(data) {
		currentFrame = data.frame;
		var scanline = 0;
		for (var i = 0; i < data.scanlines.length; ++i) {
			for (var y = scanline; y < data.scanlines[i].y; ++y) {
				video.drawScanline(y, proxyBacking);
			}
			scanline = data.scanlines[i].y + 1;
			receiveDirty(data.scanlines[i].dirty);
			video.drawScanline(data.scanlines[i].y, proxyBacking);
		}
		for (var y = scanline; y < 160; ++y) {
			video.drawScanline(y, proxyBacking);
		}
		video.finishDraw(self);
	},
};

self.onmessage = function(message) {
	handlers[message.data['type']](message.data);
};
