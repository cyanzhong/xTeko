function MemoryProxy(owner, size, blockSize) {
	this.owner = owner;
	this.blocks = [];
	this.blockSize = blockSize;
	this.mask = (1 << blockSize) - 1;
	this.size = size;
	if (blockSize) {
		for (var i = 0; i < (size >> blockSize); ++i) {
			this.blocks.push(new MemoryBlock(1 << blockSize));
		}
	} else {
		this.blockSize = 31;
		this.mask = -1;
		this.blocks[0] = new MemoryBlock(size);
	}
};

MemoryProxy.prototype.load8 = function(offset) {
	return this.blocks[offset >> this.blockSize].load8(offset & this.mask);
};

MemoryProxy.prototype.load16 = function(offset) {
	return this.blocks[offset >> this.blockSize].load16(offset & this.mask);
};

MemoryProxy.prototype.loadU8 = function(offset) {
	return this.blocks[offset >> this.blockSize].loadU8(offset & this.mask);
};

MemoryProxy.prototype.loadU16 = function(offset) {
	return this.blocks[offset >> this.blockSize].loadU16(offset & this.mask);
};

MemoryProxy.prototype.load32 = function(offset) {
	return this.blocks[offset >> this.blockSize].load32(offset & this.mask);
};

MemoryProxy.prototype.store8 = function(offset, value) {
	if (offset >= this.size) {
		return;
	}
	this.owner.memoryDirtied(this, offset >> this.blockSize);
	this.blocks[offset >> this.blockSize].store8(offset & this.mask, value);
	this.blocks[offset >> this.blockSize].store8((offset & this.mask) ^ 1, value);
};

MemoryProxy.prototype.store16 = function(offset, value) {
	if (offset >= this.size) {
		return;
	}
	this.owner.memoryDirtied(this, offset >> this.blockSize);
	return this.blocks[offset >> this.blockSize].store16(offset & this.mask, value);
};

MemoryProxy.prototype.store32 = function(offset, value) {
	if (offset >= this.size) {
		return;
	}
	this.owner.memoryDirtied(this, offset >> this.blockSize);
	return this.blocks[offset >> this.blockSize].store32(offset & this.mask, value);
};

MemoryProxy.prototype.invalidatePage = function(address) {};

function GameBoyAdvanceRenderProxy() {
	this.worker = new Worker('./js/worker.js');

	this.currentFrame = 0;
	this.delay = 0;
	this.skipFrame = false;

	this.dirty = null;
	var self = this;
	var handlers = {
		finish: function(data) {
			self.backing = data.backing;
			self.caller.finishDraw(self.backing);
			--self.delay;
		}
	};
	this.worker.onmessage = function(message) {
		handlers[message.data['type']](message.data);
	}
};

GameBoyAdvanceRenderProxy.prototype.memoryDirtied = function(mem, block) {
	this.dirty = this.dirty || {};
	this.dirty.memory = this.dirty.memory || {};
	if (mem === this.palette) {
		this.dirty.memory.palette = mem.blocks[0].buffer;
	}
	if (mem === this.oam) {
		this.dirty.memory.oam = mem.blocks[0].buffer;
	}
	if (mem === this.vram) {
		this.dirty.memory.vram = this.dirty.memory.vram || [];
		this.dirty.memory.vram[block] = mem.blocks[block].buffer;
	}
};

GameBoyAdvanceRenderProxy.prototype.clear = function(mmu) {
	this.palette = new MemoryProxy(this, mmu.SIZE_PALETTE_RAM, 0);
	this.vram = new MemoryProxy(this, mmu.SIZE_VRAM, 13);
	this.oam = new MemoryProxy(this, mmu.SIZE_OAM, 0);

	this.dirty = null;
	this.scanlineQueue = [];

	this.worker.postMessage({ type: 'clear', SIZE_VRAM: mmu.SIZE_VRAM, SIZE_OAM: mmu.SIZE_OAM });
};

GameBoyAdvanceRenderProxy.prototype.writeDisplayControl = function(value) {
	this.dirty = this.dirty || {};
	this.dirty.DISPCNT = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBackgroundControl = function(bg, value) {
	this.dirty = this.dirty || {};
	this.dirty.BGCNT = this.dirty.BGCNT || [];
	this.dirty.BGCNT[bg] = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBackgroundHOffset = function(bg, value) {
	this.dirty = this.dirty || {};
	this.dirty.BGHOFS = this.dirty.BGHOFS || [];
	this.dirty.BGHOFS[bg] = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBackgroundVOffset = function(bg, value) {
	this.dirty = this.dirty || {};
	this.dirty.BGVOFS = this.dirty.BGVOFS || [];
	this.dirty.BGVOFS[bg] = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBackgroundRefX = function(bg, value) {
	this.dirty = this.dirty || {};
	this.dirty.BGX = this.dirty.BGX || [];
	this.dirty.BGX[bg] = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBackgroundRefY = function(bg, value) {
	this.dirty = this.dirty || {};
	this.dirty.BGY = this.dirty.BGY || [];
	this.dirty.BGY[bg] = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBackgroundParamA = function(bg, value) {
	this.dirty = this.dirty || {};
	this.dirty.BGPA = this.dirty.BGPA || [];
	this.dirty.BGPA[bg] = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBackgroundParamB = function(bg, value) {
	this.dirty = this.dirty || {};
	this.dirty.BGPB = this.dirty.BGPB || [];
	this.dirty.BGPB[bg] = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBackgroundParamC = function(bg, value) {
	this.dirty = this.dirty || {};
	this.dirty.BGPC = this.dirty.BGPC || [];
	this.dirty.BGPC[bg] = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBackgroundParamD = function(bg, value) {
	this.dirty = this.dirty || {};
	this.dirty.BGPD = this.dirty.BGPD || [];
	this.dirty.BGPD[bg] = value;
};

GameBoyAdvanceRenderProxy.prototype.writeWin0H = function(value) {
	this.dirty = this.dirty || {};
	this.dirty.WIN0H = value;
};

GameBoyAdvanceRenderProxy.prototype.writeWin1H = function(value) {
	this.dirty = this.dirty || {};
	this.dirty.WIN1H = value;
};

GameBoyAdvanceRenderProxy.prototype.writeWin0V = function(value) {
	this.dirty = this.dirty || {};
	this.dirty.WIN0V = value;
};

GameBoyAdvanceRenderProxy.prototype.writeWin1V = function(value) {
	this.dirty = this.dirty || {};
	this.dirty.WIN1V = value;
};

GameBoyAdvanceRenderProxy.prototype.writeWinIn = function(value) {
	this.dirty = this.dirty || {};
	this.dirty.WININ = value;
};

GameBoyAdvanceRenderProxy.prototype.writeWinOut = function(value) {
	this.dirty = this.dirty || {};
	this.dirty.WINOUT = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBlendControl = function(value) {
	this.dirty = this.dirty || {};
	this.dirty.BLDCNT = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBlendAlpha = function(value) {
	this.dirty = this.dirty || {};
	this.dirty.BLDALPHA = value;
};

GameBoyAdvanceRenderProxy.prototype.writeBlendY = function(value) {
	this.dirty = this.dirty || {};
	this.dirty.BLDY = value;
};

GameBoyAdvanceRenderProxy.prototype.writeMosaic = function(value) {
	this.dirty = this.dirty || {};
	this.dirty.MOSAIC = value;
};

GameBoyAdvanceRenderProxy.prototype.clearSubsets = function(mmu, regions) {
	this.dirty = this.dirty || {};
	if (regions & 0x04) {
		this.palette = new MemoryProxy(this, mmu.SIZE_PALETTE_RAM, 0);
		mmu.mmap(mmu.REGION_PALETTE_RAM, this.palette);
		this.memoryDirtied(this.palette, 0);
	}
	if (regions & 0x08) {
		this.vram = new MemoryProxy(this, mmu.SIZE_VRAM, 13);
		mmu.mmap(mmu.REGION_VRAM, this.vram);
		for (var i = 0; i < this.vram.blocks.length; ++i) {
			this.memoryDirtied(this.vram, i);
		}
	}
	if (regions & 0x10) {
		this.oam = new MemoryProxy(this, mmu.SIZE_OAM, 0);
		mmu.mmap(mmu.REGION_OAM, this.oam);
		this.memoryDirtied(this.oam, 0);
	}
};

GameBoyAdvanceRenderProxy.prototype.setBacking = function(backing) {
	this.backing = backing;
	this.worker.postMessage({ type: 'start', backing: this.backing });
};

GameBoyAdvanceRenderProxy.prototype.drawScanline = function(y) {
	if (!this.skipFrame) {
		if (this.dirty) {
			if (this.dirty.memory) {
				if (this.dirty.memory.palette) {
					this.dirty.memory.palette = this.dirty.memory.palette.slice(0);
				}
				if (this.dirty.memory.oam) {
					this.dirty.memory.oam = this.dirty.memory.oam.slice(0);
				}
				if (this.dirty.memory.vram) {
					for (var i = 0; i < 12; ++i) {
						if (this.dirty.memory.vram[i]) {
							this.dirty.memory.vram[i] = this.dirty.memory.vram[i].slice(0);
						}
					}
				}
			}
			this.scanlineQueue.push({ y: y, dirty: this.dirty });
			this.dirty = null;
		}
	}
};

GameBoyAdvanceRenderProxy.prototype.startDraw = function() {
	++this.currentFrame;
	if (this.delay <= 0) {
		this.skipFrame = false;
	}
	if (!this.skipFrame) {
		++this.delay;
	}
};

GameBoyAdvanceRenderProxy.prototype.finishDraw = function(caller) {
	this.caller = caller;
	if (!this.skipFrame) {
		this.worker.postMessage({ type: 'finish', scanlines: this.scanlineQueue, frame: this.currentFrame });
		this.scanlineQueue = [];
		if (this.delay > 2) {
			this.skipFrame = true;
		}
	}
};
