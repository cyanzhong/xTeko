function GameBoyAdvanceVideo() {
	this.renderPath = new GameBoyAdvanceRenderProxy();

	this.CYCLES_PER_PIXEL = 4;

	this.HORIZONTAL_PIXELS = 240;
	this.HBLANK_PIXELS = 68;
	this.HDRAW_LENGTH = 1006;
	this.HBLANK_LENGTH = 226;
	this.HORIZONTAL_LENGTH = 1232;

	this.VERTICAL_PIXELS = 160;
	this.VBLANK_PIXELS = 68;
	this.VERTICAL_TOTAL_PIXELS = 228;

	this.TOTAL_LENGTH = 280896;

	this.drawCallback = function() {};
	this.vblankCallback = function() {};
};

GameBoyAdvanceVideo.prototype.clear = function() {
	this.renderPath.clear(this.cpu.mmu);

	// DISPSTAT
	this.DISPSTAT_MASK = 0xFF38;
	this.inHblank = false;
	this.inVblank = false;
	this.vcounter = 0;
	this.vblankIRQ = 0;
	this.hblankIRQ = 0;
	this.vcounterIRQ = 0;
	this.vcountSetting = 0;

	// VCOUNT
	this.vcount = -1;

	this.lastHblank = 0;
	this.nextHblank = this.HDRAW_LENGTH;
	this.nextEvent = this.nextHblank;

	this.nextHblankIRQ = 0;
	this.nextVblankIRQ = 0;
	this.nextVcounterIRQ = 0;
};

GameBoyAdvanceVideo.prototype.setBacking = function(backing) {
	var pixelData = backing.createImageData(this.HORIZONTAL_PIXELS, this.VERTICAL_PIXELS);
	this.context = backing;

	// Clear backing first
	for (var offset = 0; offset < this.HORIZONTAL_PIXELS * this.VERTICAL_PIXELS * 4;) {
		pixelData.data[offset++] = 0xFF;
		pixelData.data[offset++] = 0xFF;
		pixelData.data[offset++] = 0xFF;
		pixelData.data[offset++] = 0xFF;
	}

	this.renderPath.setBacking(pixelData);
}

GameBoyAdvanceVideo.prototype.updateTimers = function(cpu) {
	var cycles = cpu.cycles;

	if (this.nextEvent <= cycles) {
		if (this.inHblank) {
			// End Hblank
			this.inHblank = false;
			this.nextEvent = this.nextHblank;

			++this.vcount;

			switch (this.vcount) {
			case this.VERTICAL_PIXELS:
				this.inVblank = true;
				this.renderPath.finishDraw(this);
				this.nextVblankIRQ = this.nextEvent + this.TOTAL_LENGTH;
				this.cpu.mmu.runVblankDmas();
				if (this.vblankIRQ) {
					this.cpu.irq.raiseIRQ(this.cpu.irq.IRQ_VBLANK);
				}
				this.vblankCallback();
				break;
			case this.VERTICAL_TOTAL_PIXELS - 1:
				this.inVblank = false;
				break;
			case this.VERTICAL_TOTAL_PIXELS:
				this.vcount = 0;
				this.renderPath.startDraw();
				break;
			}

			this.vcounter = this.vcount == this.vcountSetting;
			if (this.vcounter && this.vcounterIRQ) {
				this.cpu.irq.raiseIRQ(this.cpu.irq.IRQ_VCOUNTER);
				this.nextVcounterIRQ += this.TOTAL_LENGTH;
			}

			if (this.vcount < this.VERTICAL_PIXELS) {
				this.renderPath.drawScanline(this.vcount);
			}
		} else {
			// Begin Hblank
			this.inHblank = true;
			this.lastHblank = this.nextHblank;
			this.nextEvent = this.lastHblank + this.HBLANK_LENGTH;
			this.nextHblank = this.nextEvent + this.HDRAW_LENGTH;
			this.nextHblankIRQ = this.nextHblank;

			if (this.vcount < this.VERTICAL_PIXELS) {
				this.cpu.mmu.runHblankDmas();
			}
			if (this.hblankIRQ) {
				this.cpu.irq.raiseIRQ(this.cpu.irq.IRQ_HBLANK);
			}
		}
	}
};

GameBoyAdvanceVideo.prototype.writeDisplayStat = function(value) {
	this.vblankIRQ = value & 0x0008;
	this.hblankIRQ = value & 0x0010;
	this.vcounterIRQ = value & 0x0020;
	this.vcountSetting = (value & 0xFF00) >> 8;

	if (this.vcounterIRQ) {
		// FIXME: this can be too late if we're in the middle of an Hblank
		this.nextVcounterIRQ = this.nextHblank + this.HBLANK_LENGTH + (this.vcountSetting - this.vcount) * this.HORIZONTAL_LENGTH;
		if (this.nextVcounterIRQ < this.nextEvent) {
			this.nextVcounterIRQ += this.TOTAL_LENGTH;
		}
	}
};

GameBoyAdvanceVideo.prototype.readDisplayStat = function() {
	return (this.inVblank) | (this.inHblank << 1) | (this.vcounter << 2);
};

GameBoyAdvanceVideo.prototype.finishDraw = function(pixelData) {
	this.context.putImageData(pixelData, 0, 0);
	this.drawCallback();
};
