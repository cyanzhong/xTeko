function MemoryAligned16(size) {
	this.buffer = new Uint16Array(size >> 1);
};

MemoryAligned16.prototype.load8 = function(offset) {
	return (this.loadU8(offset) << 24) >> 24;
};

MemoryAligned16.prototype.load16 = function(offset) {
	return (this.loadU16(offset) << 16) >> 16;
};

MemoryAligned16.prototype.loadU8 = function(offset) {
	var index = offset >> 1;
	if (offset & 1) {
		return (this.buffer[index] & 0xFF00) >>> 8;
	} else {
		return this.buffer[index] & 0x00FF;
	}
};

MemoryAligned16.prototype.loadU16 = function(offset) {
	return this.buffer[offset >> 1];
};

MemoryAligned16.prototype.load32 = function(offset) {
	return this.buffer[(offset >> 1) & ~1] | (this.buffer[(offset >> 1) | 1] << 16);
};

MemoryAligned16.prototype.store8 = function(offset, value) {
	var index = offset >> 1;
	this.store16(offset, (value << 8) | value);
};

MemoryAligned16.prototype.store16 = function(offset, value) {
	this.buffer[offset >> 1] = value;
};

MemoryAligned16.prototype.store32 = function(offset, value) {
	var index = offset >> 1;
	this.store16(offset, this.buffer[index] = value & 0xFFFF);
	this.store16(offset + 2, this.buffer[index + 1] = value >>> 16);
};

MemoryAligned16.prototype.insert = function(start, data) {
	this.buffer.set(data, start);
};

MemoryAligned16.prototype.invalidatePage = function(address) {};

function GameBoyAdvanceVRAM(size) {
	MemoryAligned16.call(this, size);
	this.vram = this.buffer;
};

GameBoyAdvanceVRAM.prototype = Object.create(MemoryAligned16.prototype);

function GameBoyAdvanceOAM(size) {
	MemoryAligned16.call(this, size);
	this.oam = this.buffer;
	this.objs = new Array(128);
	for (var i = 0; i < 128; ++i) {
		this.objs[i] = new GameBoyAdvanceOBJ(this, i);
	}
	this.scalerot = new Array(32);
	for (var i = 0; i < 32; ++i) {
		this.scalerot[i] = {
			a: 1,
			b: 0,
			c: 0,
			d: 1
		};
	}
};

GameBoyAdvanceOAM.prototype = Object.create(MemoryAligned16.prototype);

GameBoyAdvanceOAM.prototype.overwrite = function(memory) {
	for (var i = 0; i < (this.buffer.byteLength >> 1); ++i) {
		this.store16(i << 1, memory[i]);
	}
};

GameBoyAdvanceOAM.prototype.store16 = function(offset, value) {
	var index = (offset & 0x3F8) >> 3;
	var obj = this.objs[index];
	var scalerot = this.scalerot[index >> 2];
	var layer = obj.priority;
	var disable = obj.disable;
	var y = obj.y;
	switch (offset & 0x00000006) {
	case 0:
		// Attribute 0
		obj.y = value & 0x00FF;
		var wasScalerot = obj.scalerot;
		obj.scalerot = value & 0x0100;
		if (obj.scalerot) {
			obj.scalerotOam = this.scalerot[obj.scalerotParam];
			obj.doublesize = !!(value & 0x0200);
			obj.disable = 0;
			obj.hflip = 0;
			obj.vflip = 0;
		} else {
			obj.doublesize = false;
			obj.disable = value & 0x0200;
			if (wasScalerot) {
				obj.hflip = obj.scalerotParam & 0x0008;
				obj.vflip = obj.scalerotParam & 0x0010;
			}
		}
		obj.mode = (value & 0x0C00) >> 6; // This lines up with the stencil format
		obj.mosaic = value & 0x1000;
		obj.multipalette = value & 0x2000;
		obj.shape = (value & 0xC000) >> 14;

		obj.recalcSize();
		break;
	case 2:
		// Attribute 1
		obj.x = value & 0x01FF;
		if (obj.scalerot) {
			obj.scalerotParam = (value & 0x3E00) >> 9;
			obj.scalerotOam = this.scalerot[obj.scalerotParam];
			obj.hflip = 0;
			obj.vflip = 0;
			obj.drawScanline = obj.drawScanlineAffine;
		} else {
			obj.hflip = value & 0x1000;
			obj.vflip = value & 0x2000;
			obj.drawScanline = obj.drawScanlineNormal;
		}
		obj.size = (value & 0xC000) >> 14;

		obj.recalcSize();
		break;
	case 4:
		// Attribute 2
		obj.tileBase = value & 0x03FF;
		obj.priority = (value & 0x0C00) >> 10;
		obj.palette = (value & 0xF000) >> 8; // This is shifted up 4 to make pushPixel faster
		break;
	case 6:
		// Scaling/rotation parameter
		switch (index & 0x3) {
		case 0:
			scalerot.a = (value << 16) / 0x1000000;
			break;
		case 1:
			scalerot.b = (value << 16) / 0x1000000;
			break;
		case 2:
			scalerot.c = (value << 16) / 0x1000000;
			break;
		case 3:
			scalerot.d = (value << 16) / 0x1000000;
			break;
		}
		break;
	}

	MemoryAligned16.prototype.store16.call(this, offset, value);
};

function GameBoyAdvancePalette() {
	this.colors = [ new Array(0x100), new Array(0x100) ];
	this.adjustedColors = [ new Array(0x100), new Array(0x100) ];
	this.passthroughColors = [
		this.colors[0], // BG0
		this.colors[0], // BG1
		this.colors[0], // BG2
		this.colors[0], // BG3
		this.colors[1], // OBJ
		this.colors[0] // Backdrop
	];
	this.blendY = 1;
};

GameBoyAdvancePalette.prototype.overwrite = function(memory) {
	for (var i = 0; i < 512; ++i) {
		this.store16(i << 1, memory[i]);
	}
};

GameBoyAdvancePalette.prototype.loadU8 = function(offset) {
	return (this.loadU16(offset) >> (8 * (offset & 1))) & 0xFF;
};

GameBoyAdvancePalette.prototype.loadU16 = function(offset) {
	return this.colors[(offset & 0x200) >> 9][(offset & 0x1FF) >> 1];
};

GameBoyAdvancePalette.prototype.load16 = function(offset) {
	return (this.loadU16(offset) << 16) >> 16;
};

GameBoyAdvancePalette.prototype.load32 = function(offset) {
	return this.loadU16(offset) | (this.loadU16(offset + 2) << 16);
};

GameBoyAdvancePalette.prototype.store16 = function(offset, value) {
	var type = (offset & 0x200) >> 9;
	var index = (offset & 0x1FF) >> 1;
	this.colors[type][index] = value;
	this.adjustedColors[type][index] = this.adjustColor(value);
};

GameBoyAdvancePalette.prototype.store32 = function(offset, value) {
	this.store16(offset, value & 0xFFFF);
	this.store16(offset + 2, value >> 16);
};

GameBoyAdvancePalette.prototype.invalidatePage = function(address) {};

GameBoyAdvancePalette.prototype.convert16To32 = function(value, input) {
	var r = (value & 0x001F) << 3;
	var g = (value & 0x03E0) >> 2;
	var b = (value & 0x7C00) >> 7;

	input[0] = r;
	input[1] = g;
	input[2] = b;
};

GameBoyAdvancePalette.prototype.mix = function(aWeight, aColor, bWeight, bColor) {
	var ar = (aColor & 0x001F);
	var ag = (aColor & 0x03E0) >> 5;
	var ab = (aColor & 0x7C00) >> 10;

	var br = (bColor & 0x001F);
	var bg = (bColor & 0x03E0) >> 5;
	var bb = (bColor & 0x7C00) >> 10;

	var r = Math.min(aWeight * ar + bWeight * br, 0x1F);
	var g = Math.min(aWeight * ag + bWeight * bg, 0x1F);
	var b = Math.min(aWeight * ab + bWeight * bb, 0x1F);

	return r | (g << 5) | (b << 10);
};

GameBoyAdvancePalette.prototype.makeDarkPalettes = function(layers) {
	if (this.adjustColor != this.adjustColorDark) {
		this.adjustColor = this.adjustColorDark;
		this.resetPalettes();
	}
	this.resetPaletteLayers(layers);
};

GameBoyAdvancePalette.prototype.makeBrightPalettes = function(layers) {
	if (this.adjustColor != this.adjustColorBright) {
		this.adjustColor = this.adjustColorBright;
		this.resetPalettes();
	}
	this.resetPaletteLayers(layers);
};

GameBoyAdvancePalette.prototype.makeNormalPalettes = function() {
	this.passthroughColors[0] = this.colors[0];
	this.passthroughColors[1] = this.colors[0];
	this.passthroughColors[2] = this.colors[0];
	this.passthroughColors[3] = this.colors[0];
	this.passthroughColors[4] = this.colors[1];
	this.passthroughColors[5] = this.colors[0];
};

GameBoyAdvancePalette.prototype.makeSpecialPalette = function(layer) {
	this.passthroughColors[layer] = this.adjustedColors[layer == 4 ? 1 : 0];
};

GameBoyAdvancePalette.prototype.makeNormalPalette = function(layer) {
	this.passthroughColors[layer] = this.colors[layer == 4 ? 1 : 0];
};

GameBoyAdvancePalette.prototype.resetPaletteLayers = function(layers) {
	if (layers & 0x01) {
		this.passthroughColors[0] = this.adjustedColors[0];
	} else {
		this.passthroughColors[0] = this.colors[0];
	}
	if (layers & 0x02) {
		this.passthroughColors[1] = this.adjustedColors[0];
	} else {
		this.passthroughColors[1] = this.colors[0];
	}
	if (layers & 0x04) {
		this.passthroughColors[2] = this.adjustedColors[0];
	} else {
		this.passthroughColors[2] = this.colors[0];
	}
	if (layers & 0x08) {
		this.passthroughColors[3] = this.adjustedColors[0];
	} else {
		this.passthroughColors[3] = this.colors[0];
	}
	if (layers & 0x10) {
		this.passthroughColors[4] = this.adjustedColors[1];
	} else {
		this.passthroughColors[4] = this.colors[1];
	}
	if (layers & 0x20) {
		this.passthroughColors[5] = this.adjustedColors[0];
	} else {
		this.passthroughColors[5] = this.colors[0];
	}
};

GameBoyAdvancePalette.prototype.resetPalettes = function() {
	var i;
	var outPalette = this.adjustedColors[0];
	var inPalette = this.colors[0];
	for (i = 0; i < 256; ++i) {
		outPalette[i] = this.adjustColor(inPalette[i]);
	}

	outPalette = this.adjustedColors[1];
	inPalette = this.colors[1];
	for (i = 0; i < 256; ++i) {
		outPalette[i] = this.adjustColor(inPalette[i]);
	}
}

GameBoyAdvancePalette.prototype.accessColor = function(layer, index) {
	return this.passthroughColors[layer][index];
};

GameBoyAdvancePalette.prototype.adjustColorDark = function(color) {
	var r = (color & 0x001F);
	var g = (color & 0x03E0) >> 5;
	var b = (color & 0x7C00) >> 10;

	r = r - (r * this.blendY);
	g = g - (g * this.blendY);
	b = b - (b * this.blendY);

	return r | (g << 5) | (b << 10);
};

GameBoyAdvancePalette.prototype.adjustColorBright = function(color) {
	var r = (color & 0x001F);
	var g = (color & 0x03E0) >> 5;
	var b = (color & 0x7C00) >> 10;

	r = r + ((31 - r) * this.blendY);
	g = g + ((31 - g) * this.blendY);
	b = b + ((31 - b) * this.blendY);

	return r | (g << 5) | (b << 10);
};

GameBoyAdvancePalette.prototype.adjustColor = GameBoyAdvancePalette.prototype.adjustColorBright;

GameBoyAdvancePalette.prototype.setBlendY = function(y) {
	if (this.blendY != y) {
		this.blendY = y;
		this.resetPalettes();
	}
};

function GameBoyAdvanceOBJ(oam, index) {
	this.TILE_OFFSET = 0x10000;
	this.oam = oam;

	this.index = index;
	this.x = 0;
	this.y = 0;
	this.scalerot = 0;
	this.doublesize = false;
	this.disable = 1;
	this.mode = 0;
	this.mosaic = false;
	this.multipalette = false;
	this.shape = 0;
	this.scalerotParam = 0;
	this.hflip = 0;
	this.vflip = 0;
	this.tileBase = 0;
	this.priority = 0;
	this.palette = 0;
	this.drawScanline = this.drawScanlineNormal;
	this.pushPixel = GameBoyAdvanceSoftwareRenderer.pushPixel;
	this.cachedWidth = 8;
	this.cachedHeight = 8;
};

GameBoyAdvanceOBJ.prototype.drawScanlineNormal = function(backing, y, yOff, start, end) {
	var video = this.oam.video;
	var x;
	var underflow;
	var offset;
	var mask = this.mode | video.target2[video.LAYER_OBJ] | (this.priority << 1);
	if (this.mode == 0x10) {
		mask |= video.TARGET1_MASK;
	}
	if (video.blendMode == 1 && video.alphaEnabled) {
		mask |= video.target1[video.LAYER_OBJ];
	}

	var totalWidth = this.cachedWidth;
	if (this.x < video.HORIZONTAL_PIXELS) {
		if (this.x < start) {
			underflow = start - this.x;
			offset = start;
		} else {
			underflow = 0;
			offset = this.x;
		}
		if (end < this.cachedWidth + this.x) {
			totalWidth = end - this.x;
		}
	} else {
		underflow = start + 512 - this.x;
		offset = start;
		if (end < this.cachedWidth - underflow) {
			totalWidth = end;
		}
	}
	
	var localX;
	var localY;
	if (!this.vflip) {
		localY = y - yOff;
	} else {
		localY = this.cachedHeight - y + yOff - 1;
	}
	var localYLo = localY & 0x7;
	var mosaicX;
	var tileOffset;

	var paletteShift = this.multipalette ? 1 : 0;

	if (video.objCharacterMapping) {
		tileOffset = ((localY & 0x01F8) * this.cachedWidth) >> 6;
	} else {
		tileOffset = (localY & 0x01F8) << (2 - paletteShift);
	}

	if (this.mosaic) {
		mosaicX = video.objMosaicX - 1 - (video.objMosaicX + offset - 1) % video.objMosaicX;
		offset += mosaicX;
		underflow += mosaicX;
	}
	if (!this.hflip) {
		localX = underflow;
	} else {
		localX = this.cachedWidth - underflow - 1;
	}

	var tileRow = video.accessTile(this.TILE_OFFSET + (x & 0x4) * paletteShift, this.tileBase + (tileOffset << paletteShift) + ((localX & 0x01F8) >> (3 - paletteShift)), localYLo << paletteShift);
	for (x = underflow; x < totalWidth; ++x) {
		mosaicX = this.mosaic ? offset % video.objMosaicX : 0;
		if (!this.hflip) {
			localX = x - mosaicX;
		} else {
			localX = this.cachedWidth - (x - mosaicX) - 1;
		}
		if (!paletteShift) {
			if (!(x & 0x7) || (this.mosaic && !mosaicX)) {
				tileRow = video.accessTile(this.TILE_OFFSET, this.tileBase + tileOffset + (localX >> 3), localYLo);
			}
		} else {
			if (!(x & 0x3) || (this.mosaic && !mosaicX)) {
				tileRow = video.accessTile(this.TILE_OFFSET + (localX & 0x4), this.tileBase + (tileOffset << 1) + ((localX & 0x01F8) >> 2), localYLo << 1);
			}
		}
		this.pushPixel(video.LAYER_OBJ, this, video, tileRow, localX & 0x7, offset, backing, mask, false);
		offset++;
	}
};

GameBoyAdvanceOBJ.prototype.drawScanlineAffine = function(backing, y, yOff, start, end) {
	var video = this.oam.video;
	var x;
	var underflow;
	var offset;
	var mask = this.mode | video.target2[video.LAYER_OBJ] | (this.priority << 1);
	if (this.mode == 0x10) {
		mask |= video.TARGET1_MASK;
	}
	if (video.blendMode == 1 && video.alphaEnabled) {
		mask |= video.target1[video.LAYER_OBJ];
	}

	var localX;
	var localY;
	var yDiff = y - yOff;
	var tileOffset;

	var paletteShift = this.multipalette ? 1 : 0;
	var totalWidth = this.cachedWidth << this.doublesize;
	var totalHeight = this.cachedHeight << this.doublesize;
	var drawWidth = totalWidth;
	if (drawWidth > video.HORIZONTAL_PIXELS) {
		totalWidth = video.HORIZONTAL_PIXELS;
	}

	if (this.x < video.HORIZONTAL_PIXELS) {
		if (this.x < start) {
			underflow = start - this.x;
			offset = start;
		} else {
			underflow = 0;
			offset = this.x;
		}
		if (end < drawWidth + this.x) {
			drawWidth = end - this.x;
		}
	} else {
		underflow = start + 512 - this.x;
		offset = start;
		if (end < drawWidth - underflow) {
			drawWidth = end;
		}
	}

	for (x = underflow; x < drawWidth; ++x) {
		localX = this.scalerotOam.a * (x - (totalWidth >> 1)) + this.scalerotOam.b * (yDiff - (totalHeight >> 1)) + (this.cachedWidth >> 1);
		localY = this.scalerotOam.c * (x - (totalWidth >> 1)) + this.scalerotOam.d * (yDiff - (totalHeight >> 1)) + (this.cachedHeight >> 1);
		if (this.mosaic) {
			localX -= (x % video.objMosaicX) * this.scalerotOam.a + (y % video.objMosaicY) * this.scalerotOam.b;
			localY -= (x % video.objMosaicX) * this.scalerotOam.c + (y % video.objMosaicY) * this.scalerotOam.d;
		}

		if (localX < 0 || localX >= this.cachedWidth || localY < 0 || localY >= this.cachedHeight) {
			offset++;
			continue;
		}

		if (video.objCharacterMapping) {
			tileOffset = ((localY & 0x01F8) * this.cachedWidth) >> 6;
		} else {
			tileOffset = (localY & 0x01F8) << (2 - paletteShift);
		}
		tileRow = video.accessTile(this.TILE_OFFSET + (localX & 0x4) * paletteShift, this.tileBase + (tileOffset << paletteShift) + ((localX & 0x01F8) >> (3 - paletteShift)), (localY & 0x7) << paletteShift);
		this.pushPixel(video.LAYER_OBJ, this, video, tileRow, localX & 0x7, offset, backing, mask, false);
		offset++;
	}
};

GameBoyAdvanceOBJ.prototype.recalcSize = function() {
	switch (this.shape) {
	case 0:
		// Square
		this.cachedHeight = this.cachedWidth = 8 << this.size;
		break;
	case 1:
		// Horizontal
		switch (this.size) {
		case 0:
			this.cachedHeight = 8;
			this.cachedWidth = 16;
			break;
		case 1:
			this.cachedHeight = 8;
			this.cachedWidth = 32;
			break;
		case 2:
			this.cachedHeight = 16;
			this.cachedWidth = 32;
			break;
		case 3:
			this.cachedHeight = 32;
			this.cachedWidth = 64;
			break;
		}
		break;
	case 2:
		// Vertical
		switch (this.size) {
		case 0:
			this.cachedHeight = 16;
			this.cachedWidth = 8;
			break;
		case 1:
			this.cachedHeight = 32;
			this.cachedWidth = 8;
			break;
		case 2:
			this.cachedHeight = 32;
			this.cachedWidth = 16;
			break;
		case 3:
			this.cachedHeight = 64;
			this.cachedWidth = 32;
			break;
		}
		break;
	default:
		// Bad!
	}
};

function GameBoyAdvanceOBJLayer(video, index) {
	this.video = video;
	this.bg = false;
	this.index = video.LAYER_OBJ;
	this.priority = index;
	this.enabled = false;
	this.objwin = 0;
};

GameBoyAdvanceOBJLayer.prototype.drawScanline = function(backing, layer, start, end) {
	var y = this.video.vcount;
	var wrappedY;
	var mosaicY;
	var obj;
	if (start >= end) {
		return;
	}
	var objs = this.video.oam.objs;
	for (var i = 0; i < objs.length; ++i) {
		obj = objs[i];
		if (obj.disable) {
			continue;
		}
		if ((obj.mode & this.video.OBJWIN_MASK) != this.objwin) {
			continue;
		}
		if (!(obj.mode & this.video.OBJWIN_MASK) && this.priority != obj.priority) {
			continue;
		}
		if (obj.y < this.video.VERTICAL_PIXELS) {
			wrappedY = obj.y;
		} else {
			wrappedY = obj.y - 256;
		}
		var totalHeight;
		if (!obj.scalerot) {
			totalHeight = obj.cachedHeight;
		} else {
			totalHeight = obj.cachedHeight << obj.doublesize;
		}
		if (!obj.mosaic) {
			mosaicY = y;
		} else {
			mosaicY = y - y % this.video.objMosaicY;
		}
		if (wrappedY <= y && (wrappedY + totalHeight) > y) {
			obj.drawScanline(backing, mosaicY, wrappedY, start, end);
		}
	}
};

GameBoyAdvanceOBJLayer.prototype.objComparator = function(a, b) {
	return a.index - b.index;
};

function GameBoyAdvanceSoftwareRenderer() {
	this.LAYER_BG0 = 0;
	this.LAYER_BG1 = 1;
	this.LAYER_BG2 = 2;
	this.LAYER_BG3 = 3;
	this.LAYER_OBJ = 4;
	this.LAYER_BACKDROP = 5;

	this.HORIZONTAL_PIXELS = 240;
	this.VERTICAL_PIXELS = 160;

	this.LAYER_MASK = 0x06;
	this.BACKGROUND_MASK = 0x01;
	this.TARGET2_MASK = 0x08;
	this.TARGET1_MASK = 0x10;
	this.OBJWIN_MASK = 0x20;
	this.WRITTEN_MASK = 0x80;

	this.PRIORITY_MASK = this.LAYER_MASK | this.BACKGROUND_MASK;

	this.drawBackdrop = new (function(video) {
		this.bg = true;
		this.priority = -1;
		this.index = video.LAYER_BACKDROP;
		this.enabled = true;

		this.drawScanline = function(backing, layer, start, end) {
			// TODO: interactions with blend modes and OBJWIN
			for (var x = start; x < end; ++x) {
				if (!(backing.stencil[x] & video.WRITTEN_MASK)) {
					backing.color[x] = video.palette.accessColor(this.index, 0);
					backing.stencil[x] = video.WRITTEN_MASK;
				} else if (backing.stencil[x] & video.TARGET1_MASK) {
					backing.color[x] = video.palette.mix(video.blendB, video.palette.accessColor(this.index, 0), video.blendA, backing.color[x]);
					backing.stencil[x] = video.WRITTEN_MASK;
				}
			}
		}
	})(this);
};

GameBoyAdvanceSoftwareRenderer.prototype.clear = function(mmu) {
	this.palette = new GameBoyAdvancePalette();
	this.vram = new GameBoyAdvanceVRAM(mmu.SIZE_VRAM);
	this.oam = new GameBoyAdvanceOAM(mmu.SIZE_OAM);
	this.oam.video = this;
	this.objLayers = [
		new GameBoyAdvanceOBJLayer(this, 0),
		new GameBoyAdvanceOBJLayer(this, 1),
		new GameBoyAdvanceOBJLayer(this, 2),
		new GameBoyAdvanceOBJLayer(this, 3)
	];
	this.objwinLayer = new GameBoyAdvanceOBJLayer(this, 4);
	this.objwinLayer.objwin = this.OBJWIN_MASK;

	// DISPCNT
	this.backgroundMode = 0;
	this.displayFrameSelect = 0;
	this.hblankIntervalFree = 0;
	this.objCharacterMapping = 0;
	this.forcedBlank = 1;
	this.win0 = 0;
	this.win1 = 0;
	this.objwin = 0;

	// VCOUNT
	this.vcount = -1;

	// WIN0H
	this.win0Left = 0;
	this.win0Right = 240;

	// WIN1H
	this.win1Left = 0;
	this.win1Right = 240;

	// WIN0V
	this.win0Top = 0;
	this.win0Bottom = 160;

	// WIN1V
	this.win1Top = 0;
	this.win1Bottom = 160;

	// WININ/WINOUT
	this.windows = new Array();
	for (var i = 0; i < 4; ++i) {
		this.windows.push({
			enabled: [ false, false, false, false, false, true ],
			special: 0
		});
	};

	// BLDCNT
	this.target1 = new Array(5);
	this.target2 = new Array(5);
	this.blendMode = 0;

	// BLDALPHA
	this.blendA = 0;
	this.blendB = 0;

	// BLDY
	this.blendY = 0;

	// MOSAIC
	this.bgMosaicX = 1;
	this.bgMosaicY = 1;
	this.objMosaicX = 1;
	this.objMosaicY = 1;

	this.lastHblank = 0;
	this.nextHblank = this.HDRAW_LENGTH;
	this.nextEvent = this.nextHblank;

	this.nextHblankIRQ = 0;
	this.nextVblankIRQ = 0;
	this.nextVcounterIRQ = 0;

	this.bg = new Array();
	for (var i = 0; i < 4; ++i) {
		this.bg.push({
			bg: true,
			index: i,
			enabled: false,
			video: this,
			vram: this.vram,
			priority: 0,
			charBase: 0,
			mosaic: false,
			multipalette: false,
			screenBase: 0,
			overflow: 0,
			size: 0,
			x: 0,
			y: 0,
			refx: 0,
			refy: 0,
			dx: 1,
			dmx: 0,
			dy: 0,
			dmy: 1,
			sx: 0,
			sy: 0,
			pushPixel: GameBoyAdvanceSoftwareRenderer.pushPixel,
			drawScanline: this.drawScanlineBGMode0
		});
	}

	this.bgModes = [
		this.drawScanlineBGMode0,
		this.drawScanlineBGMode2, // Modes 1 and 2 are identical for layers 2 and 3
		this.drawScanlineBGMode2,
		this.drawScanlineBGMode3,
		this.drawScanlineBGMode4,
		this.drawScanlineBGMode5
	];

	this.drawLayers = [
		this.bg[0],
		this.bg[1],
		this.bg[2],
		this.bg[3],
		this.objLayers[0],
		this.objLayers[1],
		this.objLayers[2],
		this.objLayers[3],
		this.objwinLayer,
		this.drawBackdrop
	];

	this,objwinActive = false;
	this.alphaEnabled = false;

	this.scanline = {
		color: new Uint16Array(this.HORIZONTAL_PIXELS),
		// Stencil format:
		// Bits 0-1: Layer
		// Bit 2: Is background
		// Bit 3: Is Target 2
		// Bit 4: Is Target 1
		// Bit 5: Is OBJ Window
		// Bit 6: Reserved
		// Bit 7: Has been written
		stencil: new Uint8Array(this.HORIZONTAL_PIXELS)
	};
	this.sharedColor = [ 0, 0, 0 ];
	this.sharedMap = {
		tile: 0,
		hflip: false,
		vflip: false,
		palette: 0
	};
};

GameBoyAdvanceSoftwareRenderer.prototype.clearSubsets = function(mmu, regions) {
	if (regions & 0x04) {
		this.palette.overwrite(new Uint16Array(mmu.SIZE_PALETTE >> 1));
	}

	if (regions & 0x08) {
		this.vram.insert(0, new Uint16Array(mmu.SIZE_VRAM >> 1));
	}

	if (regions & 0x10) {
		this.oam.overwrite(new Uint16Array(mmu.SIZE_OAM >> 1));
		this.oam.video = this;
	}
}

GameBoyAdvanceSoftwareRenderer.prototype.setBacking = function(backing) {
	this.pixelData = backing;

	// Clear backing first
	for (var offset = 0; offset < this.HORIZONTAL_PIXELS * this.VERTICAL_PIXELS * 4;) {
		this.pixelData.data[offset++] = 0xFF;
		this.pixelData.data[offset++] = 0xFF;
		this.pixelData.data[offset++] = 0xFF;
		this.pixelData.data[offset++] = 0xFF;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.writeDisplayControl = function(value) {
	this.backgroundMode = value & 0x0007;
	this.displayFrameSelect = value & 0x0010;
	this.hblankIntervalFree = value & 0x0020;
	this.objCharacterMapping = value & 0x0040;
	this.forcedBlank = value & 0x0080;
	this.bg[0].enabled = value & 0x0100;
	this.bg[1].enabled = value & 0x0200;
	this.bg[2].enabled = value & 0x0400;
	this.bg[3].enabled = value & 0x0800;
	this.objLayers[0].enabled = value & 0x1000;
	this.objLayers[1].enabled = value & 0x1000;
	this.objLayers[2].enabled = value & 0x1000;
	this.objLayers[3].enabled = value & 0x1000;
	this.win0 = value & 0x2000;
	this.win1 = value & 0x4000;
	this.objwin = value & 0x8000;
	this.objwinLayer.enabled = value & 0x1000 && value & 0x8000;

	// Total hack so we can store both things that would set it to 256-color mode in the same variable
	this.bg[2].multipalette &= ~0x0001;
	this.bg[3].multipalette &= ~0x0001;
	if (this.backgroundMode > 0) {
		this.bg[2].multipalette |= 0x0001;
	}
	if (this.backgroundMode == 2) {
		this.bg[3].multipalette |= 0x0001;
	}
	
	this.resetLayers();
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBackgroundControl = function(bg, value) {
	var bgData = this.bg[bg];
	bgData.priority = value & 0x0003;
	bgData.charBase = (value & 0x000C) << 12;
	bgData.mosaic = value & 0x0040;
	bgData.multipalette &= ~0x0080;
	if (bg < 2 || this.backgroundMode == 0) {
		bgData.multipalette |= value & 0x0080;
	}
	bgData.screenBase = (value & 0x1F00) << 3;
	bgData.overflow = value & 0x2000;
	bgData.size = (value & 0xC000) >> 14;

	this.drawLayers.sort(this.layerComparator);
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBackgroundHOffset = function(bg, value) {
	this.bg[bg].x = value & 0x1FF;
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBackgroundVOffset = function(bg, value) {
	this.bg[bg].y = value & 0x1FF;
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBackgroundRefX = function(bg, value) {
	this.bg[bg].refx = (value << 4) / 0x1000;
	this.bg[bg].sx = this.bg[bg].refx;
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBackgroundRefY = function(bg, value) {
	this.bg[bg].refy = (value << 4) / 0x1000;
	this.bg[bg].sy = this.bg[bg].refy;
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBackgroundParamA = function(bg, value) {
	this.bg[bg].dx = (value << 16) / 0x1000000;
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBackgroundParamB = function(bg, value) {
	this.bg[bg].dmx = (value << 16) / 0x1000000;
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBackgroundParamC = function(bg, value) {
	this.bg[bg].dy = (value << 16) / 0x1000000;
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBackgroundParamD = function(bg, value) {
	this.bg[bg].dmy = (value << 16) / 0x1000000;
};

GameBoyAdvanceSoftwareRenderer.prototype.writeWin0H = function(value) {
	this.win0Left = (value & 0xFF00) >> 8;
	this.win0Right = Math.min(this.HORIZONTAL_PIXELS, value & 0x00FF);
	if (this.win0Left > this.win0Right) {
		this.win0Right = this.HORIZONTAL_PIXELS;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.writeWin1H = function(value) {
	this.win1Left = (value & 0xFF00) >> 8;
	this.win1Right = Math.min(this.HORIZONTAL_PIXELS, value & 0x00FF);
	if (this.win1Left > this.win1Right) {
		this.win1Right = this.HORIZONTAL_PIXELS;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.writeWin0V = function(value) {
	this.win0Top = (value & 0xFF00) >> 8;
	this.win0Bottom = Math.min(this.VERTICAL_PIXELS, value & 0x00FF);
	if (this.win0Top > this.win0Bottom) {
		this.win0Bottom = this.VERTICAL_PIXELS;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.writeWin1V = function(value) {
	this.win1Top = (value & 0xFF00) >> 8;
	this.win1Bottom = Math.min(this.VERTICAL_PIXELS, value & 0x00FF);
	if (this.win1Top > this.win1Bottom) {
		this.win1Bottom = this.VERTICAL_PIXELS;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.writeWindow = function(index, value) {
	var window = this.windows[index];
	window.enabled[0] = value & 0x01;
	window.enabled[1] = value & 0x02;
	window.enabled[2] = value & 0x04;
	window.enabled[3] = value & 0x08;
	window.enabled[4] = value & 0x10;
	window.special = value & 0x20;
};

GameBoyAdvanceSoftwareRenderer.prototype.writeWinIn = function(value) {
	this.writeWindow(0, value);
	this.writeWindow(1, value >> 8);
};

GameBoyAdvanceSoftwareRenderer.prototype.writeWinOut = function(value) {
	this.writeWindow(2, value);
	this.writeWindow(3, value >> 8);
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBlendControl = function(value) {
	this.target1[0] = !!(value & 0x0001) * this.TARGET1_MASK;
	this.target1[1] = !!(value & 0x0002) * this.TARGET1_MASK;
	this.target1[2] = !!(value & 0x0004) * this.TARGET1_MASK;
	this.target1[3] = !!(value & 0x0008) * this.TARGET1_MASK;
	this.target1[4] = !!(value & 0x0010) * this.TARGET1_MASK;
	this.target1[5] = !!(value & 0x0020) * this.TARGET1_MASK;
	this.target2[0] = !!(value & 0x0100) * this.TARGET2_MASK;
	this.target2[1] = !!(value & 0x0200) * this.TARGET2_MASK;
	this.target2[2] = !!(value & 0x0400) * this.TARGET2_MASK;
	this.target2[3] = !!(value & 0x0800) * this.TARGET2_MASK;
	this.target2[4] = !!(value & 0x1000) * this.TARGET2_MASK;
	this.target2[5] = !!(value & 0x2000) * this.TARGET2_MASK;
	this.blendMode = (value & 0x00C0) >> 6;

	switch (this.blendMode) {
	case 1:
		// Alpha
		// Fall through
	case 0:
		// Normal
		this.palette.makeNormalPalettes();
		break;
	case 2:
		// Brighter
		this.palette.makeBrightPalettes(value & 0x3F);
		break;
	case 3:
		// Darker
		this.palette.makeDarkPalettes(value & 0x3F);
		break;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.setBlendEnabled = function(layer, enabled, override) {
	this.alphaEnabled = enabled && override == 1;
	if (enabled) {
		switch (override) {
		case 1:
			// Alpha
			// Fall through
		case 0:
			// Normal
			this.palette.makeNormalPalette(layer);
			break;
		case 2:
			// Brighter
		case 3:
			// Darker
			this.palette.makeSpecialPalette(layer);
			break;
		}
	} else {
		this.palette.makeNormalPalette(layer);
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBlendAlpha = function(value) {
	this.blendA = (value & 0x001F) / 16;
	if (this.blendA > 1) {
		this.blendA = 1;
	}
	this.blendB = ((value & 0x1F00) >> 8) / 16;
	if (this.blendB > 1) {
		this.blendB = 1;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.writeBlendY = function(value) {
	this.blendY = value;
	this.palette.setBlendY(value >= 16 ? 1 : (value / 16));
};

GameBoyAdvanceSoftwareRenderer.prototype.writeMosaic = function(value) {
	this.bgMosaicX = (value & 0xF) + 1;
	this.bgMosaicY = ((value >> 4) & 0xF) + 1;
	this.objMosaicX = ((value >> 8) & 0xF) + 1;
	this.objMosaicY = ((value >> 12) & 0xF) + 1;
};

GameBoyAdvanceSoftwareRenderer.prototype.resetLayers = function() {
	if (this.backgroundMode > 1) {
		this.bg[0].enabled = false;
		this.bg[1].enabled = false;
	}
	if (this.bg[2].enabled) {
		this.bg[2].drawScanline = this.bgModes[this.backgroundMode];
	}
	if ((this.backgroundMode == 0 || this.backgroundMode == 2)) {
		if (this.bg[3].enabled) {
			this.bg[3].drawScanline = this.bgModes[this.backgroundMode];
		}
	} else {
		this.bg[3].enabled = false;
	}
	this.drawLayers.sort(this.layerComparator);
};

GameBoyAdvanceSoftwareRenderer.prototype.layerComparator = function(a, b) {
	var diff = b.priority - a.priority;
	if (!diff) {
		if (a.bg && !b.bg) {
			return -1;
		} else if (!a.bg && b.bg) {
			return 1;
		}

		return b.index - a.index;
	}
	return diff;
};

GameBoyAdvanceSoftwareRenderer.prototype.accessMapMode0 = function(base, size, x, yBase, out) {
	var offset = base + ((x >> 2) & 0x3E) + yBase;

	if (size & 1) {
		offset += (x & 0x100) << 3;
	}

	var mem = this.vram.loadU16(offset);
	out.tile = mem & 0x03FF;
	out.hflip = mem & 0x0400;
	out.vflip = mem & 0x0800;
	out.palette = (mem & 0xF000) >> 8 // This is shifted up 4 to make pushPixel faster
};

GameBoyAdvanceSoftwareRenderer.prototype.accessMapMode1 = function(base, size, x, yBase, out) {
	var offset = base + (x >> 3) + yBase;

	out.tile = this.vram.loadU8(offset);
};

GameBoyAdvanceSoftwareRenderer.prototype.accessTile = function(base, tile, y) {
	var offset = base + (tile << 5);
	offset |= y << 2;

	return this.vram.load32(offset);
}

GameBoyAdvanceSoftwareRenderer.pushPixel = function(layer, map, video, row, x, offset, backing, mask, raw) {
	var index;
	if (!raw) {
		if (this.multipalette) {
			index = (row >> (x << 3)) & 0xFF;
		} else {
			index = (row >> (x << 2)) & 0xF;
		}
		// Index 0 is transparent
		if (!index) {
			return;
		} else if (!this.multipalette) {
			index |= map.palette;
		}
	}

	var stencil = video.WRITTEN_MASK;
	var oldStencil = backing.stencil[offset];
	var blend = video.blendMode;
	if (video.objwinActive) {
		if (oldStencil & video.OBJWIN_MASK) {
			if (video.windows[3].enabled[layer]) {
				video.setBlendEnabled(layer, video.windows[3].special && video.target1[layer], blend);
				if (video.windows[3].special && video.alphaEnabled) {
					mask |= video.target1[layer];
				}
				stencil |= video.OBJWIN_MASK;
			} else {
				return;
			}
		} else if (video.windows[2].enabled[layer]) {
			video.setBlendEnabled(layer, video.windows[2].special && video.target1[layer], blend);
			if (video.windows[2].special && video.alphaEnabled) {
				mask |= video.target1[layer];
			}
		} else {
			return;
		}
	}

	if ((mask & video.TARGET1_MASK) && (oldStencil & video.TARGET2_MASK)) {
		video.setBlendEnabled(layer, true, 1);
	}

	var pixel = raw ? row : video.palette.accessColor(layer, index);

	if (mask & video.TARGET1_MASK) {
		video.setBlendEnabled(layer, !!blend, blend);
	}
	var highPriority = (mask & video.PRIORITY_MASK) < (oldStencil & video.PRIORITY_MASK);
	// Backgrounds can draw over each other, too.
	if ((mask & video.PRIORITY_MASK) == (oldStencil & video.PRIORITY_MASK)) {
		highPriority = mask & video.BACKGROUND_MASK;
	}

	if (!(oldStencil & video.WRITTEN_MASK)) {
		// Nothing here yet, just continue
		stencil |= mask;
	} else if (highPriority) {
		// We are higher priority
		if (mask & video.TARGET1_MASK && oldStencil & video.TARGET2_MASK) {
			pixel = video.palette.mix(video.blendA, pixel, video.blendB, backing.color[offset]);
		}
		// We just drew over something, so it doesn't make sense for us to be a TARGET1 anymore...
		stencil |= mask & ~video.TARGET1_MASK;
	} else if ((mask & video.PRIORITY_MASK) > (oldStencil & video.PRIORITY_MASK)) {
		// We're below another layer, but might be the blend target for it
		stencil = oldStencil & ~(video.TARGET1_MASK | video.TARGET2_MASK);
		if (mask & video.TARGET2_MASK && oldStencil & video.TARGET1_MASK) {
			pixel = video.palette.mix(video.blendB, pixel, video.blendA, backing.color[offset]);
		} else {
			return;
		}
	} else {
		return;
	}

	if (mask & video.OBJWIN_MASK) {
		// We ARE the object window, don't draw pixels!
		backing.stencil[offset] |= video.OBJWIN_MASK;
		return;
	}
	backing.color[offset] = pixel;
	backing.stencil[offset] = stencil;
};

GameBoyAdvanceSoftwareRenderer.prototype.identity = function(x) {
	return x;
};

GameBoyAdvanceSoftwareRenderer.prototype.drawScanlineBlank = function(backing) {
	for (var x = 0; x < this.HORIZONTAL_PIXELS; ++x) {
		backing.color[x] = 0xFFFF;
		backing.stencil[x] = 0;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.prepareScanline = function(backing) {
	for (var x = 0; x < this.HORIZONTAL_PIXELS; ++x) {
		backing.stencil[x] = this.target2[this.LAYER_BACKDROP];
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.drawScanlineBGMode0 = function(backing, bg, start, end) {
	var video = this.video;
	var x;
	var y = video.vcount;
	var offset = start;
	var xOff = bg.x;
	var yOff = bg.y;
	var localX;
	var localXLo;
	var localY = y + yOff;
	if (this.mosaic) {
		localY -= y % video.bgMosaicY;
	}
	var localYLo = localY & 0x7;
	var mosaicX;
	var screenBase = bg.screenBase;
	var charBase = bg.charBase;
	var size = bg.size;
	var index = bg.index;
	var map = video.sharedMap;
	var paletteShift = bg.multipalette ? 1 : 0;
	var mask = video.target2[index] | (bg.priority << 1) | video.BACKGROUND_MASK;
	if (video.blendMode == 1 && video.alphaEnabled) {
		mask |= video.target1[index];
	}

	var yBase = (localY << 3) & 0x7C0;
	if (size == 2) {
		yBase += (localY << 3) & 0x800;
	} else if (size == 3) {
		yBase += (localY << 4) & 0x1000;
	}

	var xMask;
	if (size & 1) {
		xMask = 0x1FF;
	} else {
		xMask = 0xFF;
	}

	video.accessMapMode0(screenBase, size, (start + xOff) & xMask, yBase, map);
	var tileRow = video.accessTile(charBase, map.tile << paletteShift, (!map.vflip ? localYLo : 7 - localYLo) << paletteShift);
	for (x = start; x < end; ++x) {
		localX = (x + xOff) & xMask;
		mosaicX = this.mosaic ? offset % video.bgMosaicX : 0;
		localX -= mosaicX;
		localXLo = localX & 0x7;
		if (!paletteShift) {
			if (!localXLo || (this.mosaic && !mosaicX)) {
				video.accessMapMode0(screenBase, size, localX, yBase, map);
				tileRow = video.accessTile(charBase, map.tile, !map.vflip ? localYLo : 7 - localYLo);
				if (!tileRow && !localXLo) {
					x += 7;
					offset += 8;
					continue;
				}
			}
		} else {
			if (!localXLo || (this.mosaic && !mosaicX)) {
				video.accessMapMode0(screenBase, size, localX, yBase, map);
			}
			if (!(localXLo & 0x3) || (this.mosaic && !mosaicX)) {
				tileRow = video.accessTile(charBase + (!!(localX & 0x4) == !map.hflip ? 4 : 0), map.tile << 1, (!map.vflip ? localYLo : 7 - localYLo) << 1);
				if (!tileRow && !(localXLo & 0x3)) {
					x += 3;
					offset += 4;
					continue;
				}
			}
		}
		if (map.hflip) {
			localXLo = 7 - localXLo;
		}
		bg.pushPixel(index, map, video, tileRow, localXLo, offset, backing, mask, false);
		offset++;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.drawScanlineBGMode2 = function(backing, bg, start, end) {
	var video = this.video;
	var x;
	var y = video.vcount;
	var offset = start;
	var localX;
	var localY;
	var screenBase = bg.screenBase;
	var charBase = bg.charBase;
	var size = bg.size;
	var sizeAdjusted = 128 << size;
	var index = bg.index;
	var map = video.sharedMap;
	var color;
	var mask = video.target2[index] | (bg.priority << 1) | video.BACKGROUND_MASK;
	if (video.blendMode == 1 && video.alphaEnabled) {
		mask |= video.target1[index];
	}

	var yBase;

	for (x = start; x < end; ++x) {
		localX = bg.dx * x + bg.sx;
		localY = bg.dy * x + bg.sy;
		if (this.mosaic) {
			localX -= (x % video.bgMosaicX) * bg.dx + (y % video.bgMosaicY) * bg.dmx;
			localY -= (x % video.bgMosaicX) * bg.dy + (y % video.bgMosaicY) * bg.dmy;
		}
		if (bg.overflow) {
			localX &= sizeAdjusted - 1;
			if (localX < 0) {
				localX += sizeAdjusted;
			}
			localY &= sizeAdjusted - 1;
			if (localY < 0) {
				localY += sizeAdjusted;
			}
		} else if (localX < 0 || localY < 0 || localX >= sizeAdjusted || localY >= sizeAdjusted) {
			offset++;
			continue;
		}
		yBase = ((localY << 1) & 0x7F0) << size;
		video.accessMapMode1(screenBase, size, localX, yBase, map);
		color = this.vram.loadU8(charBase + (map.tile << 6) + ((localY & 0x7) << 3) + (localX & 0x7));
		bg.pushPixel(index, map, video, color, 0, offset, backing, mask, false);
		offset++;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.drawScanlineBGMode3 = function(backing, bg, start, end) {
	var video = this.video;
	var x;
	var y = video.vcount;
	var offset = start;
	var localX;
	var localY;
	var index = bg.index;
	var map = video.sharedMap;
	var color;
	var mask = video.target2[index] | (bg.priority << 1) | video.BACKGROUND_MASK;
	if (video.blendMode == 1 && video.alphaEnabled) {
		mask |= video.target1[index];
	}

	var yBase;

	for (x = start; x < end; ++x) {
		localX = bg.dx * x + bg.sx;
		localY = bg.dy * x + bg.sy;
		if (this.mosaic) {
			localX -= (x % video.bgMosaicX) * bg.dx + (y % video.bgMosaicY) * bg.dmx;
			localY -= (x % video.bgMosaicX) * bg.dy + (y % video.bgMosaicY) * bg.dmy;
		}
		if (localX < 0 || localY < 0 || localX >= video.HORIZONTAL_PIXELS || localY >= video.VERTICAL_PIXELS) {
			offset++;
			continue;
		}
		color = this.vram.loadU16(((localY * video.HORIZONTAL_PIXELS) + localX) << 1);
		bg.pushPixel(index, map, video, color, 0, offset, backing, mask, true);
		offset++;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.drawScanlineBGMode4 = function(backing, bg, start, end) {
	var video = this.video;
	var x;
	var y = video.vcount;
	var offset = start;
	var localX;
	var localY;
	var charBase = 0;
	if (video.displayFrameSelect) {
		charBase += 0xA000;
	}
	var size = bg.size;
	var index = bg.index;
	var map = video.sharedMap;
	var color;
	var mask = video.target2[index] | (bg.priority << 1) | video.BACKGROUND_MASK;
	if (video.blendMode == 1 && video.alphaEnabled) {
		mask |= video.target1[index];
	}

	var yBase;

	for (x = start; x < end; ++x) {
		localX = bg.dx * x + bg.sx;
		localY = 0 | bg.dy * x + bg.sy;
		if (this.mosaic) {
			localX -= (x % video.bgMosaicX) * bg.dx + (y % video.bgMosaicY) * bg.dmx;
			localY -= (x % video.bgMosaicX) * bg.dy + (y % video.bgMosaicY) * bg.dmy;
		}
		yBase = (localY << 2) & 0x7E0;
		if (localX < 0 || localY < 0 || localX >= video.HORIZONTAL_PIXELS || localY >= video.VERTICAL_PIXELS) {
			offset++;
			continue;
		}
		color = this.vram.loadU8(charBase + (localY * video.HORIZONTAL_PIXELS) + localX);
		bg.pushPixel(index, map, video, color, 0, offset, backing, mask, false);
		offset++;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.drawScanlineBGMode5 = function(backing, bg, start, end) {
	var video = this.video;
	var x;
	var y = video.vcount;
	var offset = start;
	var localX;
	var localY;
	var charBase = 0;
	if (video.displayFrameSelect) {
		charBase += 0xA000;
	}
	var index = bg.index;
	var map = video.sharedMap;
	var color;
	var mask = video.target2[index] | (bg.priority << 1) | video.BACKGROUND_MASK;
	if (video.blendMode == 1 && video.alphaEnabled) {
		mask |= video.target1[index];
	}

	var yBase;

	for (x = start; x < end; ++x) {
		localX = bg.dx * x + bg.sx;
		localY = bg.dy * x + bg.sy;
		if (this.mosaic) {
			localX -= (x % video.bgMosaicX) * bg.dx + (y % video.bgMosaicY) * bg.dmx;
			localY -= (x % video.bgMosaicX) * bg.dy + (y % video.bgMosaicY) * bg.dmy;
		}
		if (localX < 0 || localY < 0 || localX >= 160 || localY >= 128) {
			offset++;
			continue;
		}
		color = this.vram.loadU16(charBase + ((localY * 160) + localX) << 1);
		bg.pushPixel(index, map, video, color, 0, offset, backing, mask, true);
		offset++;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.drawScanline = function(y) {
	var backing = this.scanline;
	if (this.forcedBlank) {
		this.drawScanlineBlank(backing);
		return;
	}
	this.prepareScanline(backing);
	var layer;
	var firstStart;
	var firstEnd;
	var lastStart;
	var lastEnd;
	this.vcount = y;
	// Draw lower priority first and then draw over them
	for (var i = 0; i < this.drawLayers.length; ++i) {
		layer = this.drawLayers[i];
		if (!layer.enabled) {
			continue;
		}
		this.objwinActive = false;
		if (!(this.win0 || this.win1 || this.objwin)) {
			this.setBlendEnabled(layer.index, this.target1[layer.index], this.blendMode);
			layer.drawScanline(backing, layer, 0, this.HORIZONTAL_PIXELS);
		} else {
			firstStart = 0;
			firstEnd = this.HORIZONTAL_PIXELS;
			lastStart = 0;
			lastEnd = this.HORIZONTAL_PIXELS;
			if (this.win0 && y >= this.win0Top && y < this.win0Bottom) {
				if (this.windows[0].enabled[layer.index]) {
					this.setBlendEnabled(layer.index, this.windows[0].special && this.target1[layer.index], this.blendMode);
					layer.drawScanline(backing, layer, this.win0Left, this.win0Right);
				}
				firstStart = Math.max(firstStart, this.win0Left);
				firstEnd = Math.min(firstEnd, this.win0Left);
				lastStart = Math.max(lastStart, this.win0Right);
				lastEnd = Math.min(lastEnd, this.win0Right);
			}
			if (this.win1 && y >= this.win1Top && y < this.win1Bottom) {
				if (this.windows[1].enabled[layer.index]) {
					this.setBlendEnabled(layer.index, this.windows[1].special && this.target1[layer.index], this.blendMode);
					if (!this.windows[0].enabled[layer.index] && (this.win1Left < firstStart || this.win1Right < lastStart)) {
						// We've been cut in two by window 0!
						layer.drawScanline(backing, layer, this.win1Left, firstStart);
						layer.drawScanline(backing, layer, lastEnd, this.win1Right);
					} else {
						layer.drawScanline(backing, layer, this.win1Left, this.win1Right);
					}
				}
				firstStart = Math.max(firstStart, this.win1Left);
				firstEnd = Math.min(firstEnd, this.win1Left);
				lastStart = Math.max(lastStart, this.win1Right);
				lastEnd = Math.min(lastEnd, this.win1Right);
			}
			// Do last two
			if (this.windows[2].enabled[layer.index] || (this.objwin && this.windows[3].enabled[layer.index])) {
				// WINOUT/OBJWIN
				this.objwinActive = this.objwin;
				this.setBlendEnabled(layer.index, this.windows[2].special && this.target1[layer.index], this.blendMode); // Window 3 handled in pushPixel
				if (firstEnd > lastStart) {
					layer.drawScanline(backing, layer, 0, this.HORIZONTAL_PIXELS);
				} else {
					if (firstEnd) {
						layer.drawScanline(backing, layer, 0, firstEnd);
					}
					if (lastStart < this.HORIZONTAL_PIXELS) {
						layer.drawScanline(backing, layer, lastStart, this.HORIZONTAL_PIXELS);
					}
					if (lastEnd < firstStart) {
						layer.drawScanline(backing, layer, lastEnd, firstStart);
					}
				}
			}

			this.setBlendEnabled(this.LAYER_BACKDROP, this.target1[this.LAYER_BACKDROP] && this.windows[2].special, this.blendMode);
		}
		if (layer.bg) {
			layer.sx += layer.dmx;
			layer.sy += layer.dmy;
		}
	}

	this.finishScanline(backing);
};

GameBoyAdvanceSoftwareRenderer.prototype.finishScanline = function(backing) {
	var color;
	var bd = this.palette.accessColor(this.LAYER_BACKDROP, 0);
	var xx = this.vcount * this.HORIZONTAL_PIXELS * 4;
	var isTarget2 = this.target2[this.LAYER_BACKDROP];
	for (var x = 0; x < this.HORIZONTAL_PIXELS; ++x) {
		if (backing.stencil[x] & this.WRITTEN_MASK) {
			color = backing.color[x];
			if (isTarget2 && backing.stencil[x] & this.TARGET1_MASK) {
				color = this.palette.mix(this.blendA, color, this.blendB, bd);
			}
			this.palette.convert16To32(color, this.sharedColor);
		} else {
			this.palette.convert16To32(bd, this.sharedColor);
		}
		this.pixelData.data[xx++] = this.sharedColor[0];
		this.pixelData.data[xx++] = this.sharedColor[1];
		this.pixelData.data[xx++] = this.sharedColor[2];
		xx++;
	}
};

GameBoyAdvanceSoftwareRenderer.prototype.startDraw = function() {
	// Nothing to do
};

GameBoyAdvanceSoftwareRenderer.prototype.finishDraw = function(caller) {
	this.bg[2].sx = this.bg[2].refx;
	this.bg[2].sy = this.bg[2].refy;
	this.bg[3].sx = this.bg[3].refx;
	this.bg[3].sy = this.bg[3].refy;
	caller.finishDraw(this.pixelData);
};
