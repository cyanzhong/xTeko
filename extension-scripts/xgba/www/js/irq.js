function GameBoyAdvanceInterruptHandler() {
	this.inherit();
	this.FREQUENCY = 0x1000000;

	this.cpu = null;
	this.enable = false;

	this.IRQ_VBLANK = 0x0;
	this.IRQ_HBLANK = 0x1;
	this.IRQ_VCOUNTER = 0x2;
	this.IRQ_TIMER0 = 0x3;
	this.IRQ_TIMER1 = 0x4;
	this.IRQ_TIMER2 = 0x5;
	this.IRQ_TIMER3 = 0x6;
	this.IRQ_SIO = 0x7;
	this.IRQ_DMA0 = 0x8;
	this.IRQ_DMA1 = 0x9;
	this.IRQ_DMA2 = 0xA;
	this.IRQ_DMA3 = 0xB;
	this.IRQ_KEYPAD = 0xC;
	this.IRQ_GAMEPAK = 0xD;

	this.MASK_VBLANK = 0x0001;
	this.MASK_HBLANK = 0x0002;
	this.MASK_VCOUNTER = 0x0004;
	this.MASK_TIMER0 = 0x0008;
	this.MASK_TIMER1 = 0x0010;
	this.MASK_TIMER2 = 0x0020;
	this.MASK_TIMER3 = 0x0040;
	this.MASK_SIO = 0x0080;
	this.MASK_DMA0 = 0x0100;
	this.MASK_DMA1 = 0x0200;
	this.MASK_DMA2 = 0x0400;
	this.MASK_DMA3 = 0x0800;
	this.MASK_KEYPAD = 0x1000;
	this.MASK_GAMEPAK = 0x2000;
};

GameBoyAdvanceInterruptHandler.prototype.clear = function() {
	this.enable = false;
	this.enabledIRQs = 0;
	this.interruptFlags = 0;

	this.dma = new Array();
	for (var i = 0; i < 4; ++i) {
		this.dma.push({
			source: 0,
			dest: 0,
			count: 0,
			nextSource: 0,
			nextDest: 0,
			nextCount: 0,
			srcControl: 0,
			dstControl: 0,
			repeat: false,
			width: 0,
			drq: false,
			timing: 0,
			doIrq: false,
			enable: false,
			nextIRQ: 0
		});
	}

	this.timersEnabled = 0;
	this.timers = new Array();
	for (var i = 0; i < 4; ++i) {
		this.timers.push({
			reload: 0,
			oldReload: 0,
			prescaleBits: 0,
			countUp: false,
			doIrq: false,
			enable: false,
			lastEvent: 0,
			nextEvent: 0,
			overflowInterval: 1
		});
	}

	this.nextEvent = 0;
	this.springIRQ = false;
	this.resetSP();
};

GameBoyAdvanceInterruptHandler.prototype.updateTimers = function() {
	if (this.nextEvent > this.cpu.cycles) {
		return;
	}

	if (this.springIRQ) {
		this.cpu.raiseIRQ();
		this.springIRQ = false;
	}

	this.video.updateTimers(this.cpu);
	this.audio.updateTimers();
	if (this.timersEnabled) {
		var timer = this.timers[0];
		if (timer.enable) {
			if (this.cpu.cycles >= timer.nextEvent) {
				timer.lastEvent = timer.nextEvent;
				timer.nextEvent += timer.overflowInterval;
				this.io.registers[this.io.TM0CNT_LO >> 1] = timer.reload;
				timer.oldReload = timer.reload;

				if (timer.doIrq) {
					this.raiseIRQ(this.IRQ_TIMER0);
				}

				if (this.audio.enabled) {
					if (this.audio.enableChannelA && !this.audio.soundTimerA && this.audio.dmaA >= 0) {
						this.audio.sampleFifoA();
					}
	
					if (this.audio.enableChannelB && !this.audio.soundTimerB && this.audio.dmaB >= 0) {
						this.audio.sampleFifoB();
					}
				}

				timer = this.timers[1];
				if (timer.countUp) {
					if (++this.io.registers[this.io.TM1CNT_LO >> 1] == 0x10000) {
						timer.nextEvent = this.cpu.cycles;
					}
				}
			}
		}

		timer = this.timers[1];
		if (timer.enable) {
			if (this.cpu.cycles >= timer.nextEvent) {
				timer.lastEvent = timer.nextEvent;
				timer.nextEvent += timer.overflowInterval;
				if (!timer.countUp || this.io.registers[this.io.TM1CNT_LO >> 1] == 0x10000) {
					this.io.registers[this.io.TM1CNT_LO >> 1] = timer.reload;
				}
				timer.oldReload = timer.reload;

				if (timer.doIrq) {
					this.raiseIRQ(this.IRQ_TIMER1);
				}

				if (timer.countUp) {
					timer.nextEvent = 0;
				}

				if (this.audio.enabled) {
					if (this.audio.enableChannelA && this.audio.soundTimerA && this.audio.dmaA >= 0) {
						this.audio.sampleFifoA();
					}
	
					if (this.audio.enableChannelB && this.audio.soundTimerB && this.audio.dmaB >= 0) {
						this.audio.sampleFifoB();
					}
				}

				timer = this.timers[2];
				if (timer.countUp) {
					if (++this.io.registers[this.io.TM2CNT_LO >> 1] == 0x10000) {
						timer.nextEvent = this.cpu.cycles;
					}
				}
			}
		}

		timer = this.timers[2];
		if (timer.enable) {
			if (this.cpu.cycles >= timer.nextEvent) {
				timer.lastEvent = timer.nextEvent;
				timer.nextEvent += timer.overflowInterval;
				if (!timer.countUp || this.io.registers[this.io.TM2CNT_LO >> 1] == 0x10000) {
					this.io.registers[this.io.TM2CNT_LO >> 1] = timer.reload;
				}
				timer.oldReload = timer.reload;

				if (timer.doIrq) {
					this.raiseIRQ(this.IRQ_TIMER2);
				}

				if (timer.countUp) {
					timer.nextEvent = 0;
				}

				timer = this.timers[3];
				if (timer.countUp) {
					if (++this.io.registers[this.io.TM3CNT_LO >> 1] == 0x10000) {
						timer.nextEvent = this.cpu.cycles;
					}
				}
			}
		}

		timer = this.timers[3];
		if (timer.enable) {
			if (this.cpu.cycles >= timer.nextEvent) {
				timer.lastEvent = timer.nextEvent;
				timer.nextEvent += timer.overflowInterval;
				if (!timer.countUp || this.io.registers[this.io.TM3CNT_LO >> 1] == 0x10000) {
					this.io.registers[this.io.TM3CNT_LO >> 1] = timer.reload;
				}
				timer.oldReload = timer.reload;

				if (timer.doIrq) {
					this.raiseIRQ(this.IRQ_TIMER3);
				}

				if (timer.countUp) {
					timer.nextEvent = 0;
				}
			}
		}
	}

	var dma = this.dma[0];
	if (dma.enable && dma.doIrq && dma.nextIRQ && this.cpu.cycles >= dma.nextIRQ) {
		dma.nextIRQ = 0;
		this.raiseIRQ(this.IRQ_DMA0);
	}

	dma = this.dma[1];
	if (dma.enable && dma.doIrq && dma.nextIRQ && this.cpu.cycles >= dma.nextIRQ) {
		dma.nextIRQ = 0;
		this.raiseIRQ(this.IRQ_DMA1);
	}

	dma = this.dma[2];
	if (dma.enable && dma.doIrq && dma.nextIRQ && this.cpu.cycles >= dma.nextIRQ) {
		dma.nextIRQ = 0;
		this.raiseIRQ(this.IRQ_DMA2);
	}

	dma = this.dma[3];
	if (dma.enable && dma.doIrq && dma.nextIRQ && this.cpu.cycles >= dma.nextIRQ) {
		dma.nextIRQ = 0;
		this.raiseIRQ(this.IRQ_DMA3);
	}

	this.pollNextEvent();
}

GameBoyAdvanceInterruptHandler.prototype.resetSP = function() {
	this.cpu.switchMode(this.cpu.MODE_SUPERVISOR);
	this.cpu.gprs[this.cpu.SP] = 0x3007FE0;
	this.cpu.switchMode(this.cpu.MODE_IRQ);
	this.cpu.gprs[this.cpu.SP] = 0x3007FA0;
	this.cpu.switchMode(this.cpu.MODE_SYSTEM);
	this.cpu.gprs[this.cpu.SP] = 0x3007F00;
};

GameBoyAdvanceInterruptHandler.prototype.swi32 = function(opcode) {
	this.swi(opcode >> 16);
};

GameBoyAdvanceInterruptHandler.prototype.swi = function(opcode) {
	if (this.core.mmu.bios.real) {
		this.cpu.raiseTrap();
		return;
	}

	switch (opcode) {
	case 0x00:
		// SoftReset
		var mem = this.core.mmu.memory[this.core.mmu.REGION_WORKING_IRAM];
		var flag = mem.loadU8(0x7FFA);
		for (var i = 0x7E00; i < 0x8000; i += 4) {
			mem.store32(i, 0);
		}
		this.resetSP();
		if (!flag) {
			this.cpu.gprs[this.cpu.LR] = 0x08000000;
		} else {
			this.cpu.gprs[this.cpu.LR] = 0x02000000;
		}
		this.cpu.switchExecMode(this.cpu.MODE_ARM);
		this.cpu.instruction.writesPC = true;
		this.cpu.gprs[this.cpu.PC] = this.cpu.gprs[this.cpu.LR];
		break;
	case 0x01:
		// RegisterRamReset
		var regions = this.cpu.gprs[0];
		if (regions & 0x01) {
			this.core.mmu.memory[this.core.mmu.REGION_WORKING_RAM] = new MemoryBlock(this.core.mmu.SIZE_WORKING_RAM, 9);
		}
		if (regions & 0x02) {
			for (var i = 0; i < this.core.mmu.SIZE_WORKING_IRAM - 0x200; i += 4) {
				this.core.mmu.memory[this.core.mmu.REGION_WORKING_IRAM].store32(i, 0);
			}
		}
		if (regions & 0x1C) {
			this.video.renderPath.clearSubsets(this.core.mmu, regions);
		}
		if (regions & 0xE0) {
			this.core.STUB('Unimplemented RegisterRamReset');
		}
		break;
	case 0x02:
		// Halt
		this.halt();
		break;
	case 0x05:
		// VBlankIntrWait
		this.cpu.gprs[0] = 1;
		this.cpu.gprs[1] = 1;
		// Fall through:
	case 0x04:
		// IntrWait
		if (!this.enable) {
			this.io.store16(this.io.IME, 1);
		}
		if (!this.cpu.gprs[0] && this.interruptFlags & this.cpu.gprs[1]) {
			return;
		}
		this.dismissIRQs(0xFFFFFFFF);
		this.cpu.raiseTrap();
		break;
	case 0x06:
		// Div
		var result = (this.cpu.gprs[0] | 0) / (this.cpu.gprs[1] | 0);
		var mod = (this.cpu.gprs[0] | 0) % (this.cpu.gprs[1] | 0);
		this.cpu.gprs[0] = result | 0;
		this.cpu.gprs[1] = mod | 0;
		this.cpu.gprs[3] = Math.abs(result | 0);
		break;
	case 0x07:
		// DivArm
		var result = (this.cpu.gprs[1] | 0) / (this.cpu.gprs[0] | 0);
		var mod = (this.cpu.gprs[1] | 0) % (this.cpu.gprs[0] | 0);
		this.cpu.gprs[0] = result | 0;
		this.cpu.gprs[1] = mod | 0;
		this.cpu.gprs[3] = Math.abs(result | 0);
		break;
	case 0x08:
		// Sqrt
		var root = Math.sqrt(this.cpu.gprs[0]);
		this.cpu.gprs[0] = root | 0; // Coerce down to int
		break;
	case 0x0A:
		// ArcTan2
		var x = this.cpu.gprs[0] / 16384;
		var y = this.cpu.gprs[1] / 16384;
		this.cpu.gprs[0] = (Math.atan2(y, x) / (2 * Math.PI)) * 0x10000;
		break;
	case 0x0B:
		// CpuSet
		var source = this.cpu.gprs[0];
		var dest = this.cpu.gprs[1];
		var mode = this.cpu.gprs[2];
		var count = mode & 0x000FFFFF;
		var fill = mode & 0x01000000;
		var wordsize = (mode & 0x04000000) ? 4 : 2;
		if (fill) {
			if (wordsize == 4) {
				source &= 0xFFFFFFFC;
				dest &= 0xFFFFFFFC;
				var word = this.cpu.mmu.load32(source);
				for (var i = 0; i < count; ++i) {
					this.cpu.mmu.store32(dest + (i << 2), word);
				}
			} else {
				source &= 0xFFFFFFFE;
				dest &= 0xFFFFFFFE;
				var word = this.cpu.mmu.load16(source);
				for (var i = 0; i < count; ++i) {
					this.cpu.mmu.store16(dest + (i << 1), word);
				}
			}
		} else {
			if (wordsize == 4) {
				source &= 0xFFFFFFFC;
				dest &= 0xFFFFFFFC;
				for (var i = 0; i < count; ++i) {
					var word = this.cpu.mmu.load32(source + (i << 2));
					this.cpu.mmu.store32(dest + (i << 2), word);
				}
			} else {
				source &= 0xFFFFFFFE;
				dest &= 0xFFFFFFFE;
				for (var i = 0; i < count; ++i) {
					var word = this.cpu.mmu.load16(source + (i << 1));
					this.cpu.mmu.store16(dest + (i << 1), word);
				}
			}
		}
		return;
	case 0x0C:
		// FastCpuSet
		var source = this.cpu.gprs[0] & 0xFFFFFFFC;
		var dest = this.cpu.gprs[1] & 0xFFFFFFFC;
		var mode = this.cpu.gprs[2];
		var count = mode & 0x000FFFFF;
		count = ((count + 7) >> 3) << 3;
		var fill = mode & 0x01000000;
		if (fill) {
			var word = this.cpu.mmu.load32(source);
			for (var i = 0; i < count; ++i) {
				this.cpu.mmu.store32(dest + (i << 2), word);
			}
		} else {
			for (var i = 0; i < count; ++i) {
				var word = this.cpu.mmu.load32(source + (i << 2));
				this.cpu.mmu.store32(dest + (i << 2), word);
			}
		}
		return;
	case 0x0E:
		// BgAffineSet
		var i = this.cpu.gprs[2];
		var ox, oy;
		var cx, cy;
		var sx, sy;
		var theta;
		var offset = this.cpu.gprs[0];
		var destination = this.cpu.gprs[1];
		var a, b, c, d;
		var rx, ry;
		while (i--) {
			// [ sx   0  0 ]   [ cos(theta)  -sin(theta)  0 ]   [ 1  0  cx - ox ]   [ A B rx ]
			// [  0  sy  0 ] * [ sin(theta)   cos(theta)  0 ] * [ 0  1  cy - oy ] = [ C D ry ]
			// [  0   0  1 ]   [     0            0       1 ]   [ 0  0     1    ]   [ 0 0  1 ]
			ox = this.core.mmu.load32(offset) / 256;
			oy = this.core.mmu.load32(offset + 4) / 256;
			cx = this.core.mmu.load16(offset + 8);
			cy = this.core.mmu.load16(offset + 10);
			sx = this.core.mmu.load16(offset + 12) / 256;
			sy = this.core.mmu.load16(offset + 14) / 256;
			theta = (this.core.mmu.loadU16(offset + 16) >> 8) / 128 * Math.PI;
			offset += 20;
			// Rotation
			a = d = Math.cos(theta);
			b = c = Math.sin(theta);
			// Scale
			a *= sx;
			b *= -sx;
			c *= sy;
			d *= sy;
			// Translate
			rx = ox - (a * cx + b * cy);
			ry = oy - (c * cx + d * cy);
			this.core.mmu.store16(destination, (a * 256) | 0);
			this.core.mmu.store16(destination + 2, (b * 256) | 0);
			this.core.mmu.store16(destination + 4, (c * 256) | 0);
			this.core.mmu.store16(destination + 6, (d * 256) | 0);
			this.core.mmu.store32(destination + 8, (rx * 256) | 0);
			this.core.mmu.store32(destination + 12, (ry * 256) | 0);
			destination += 16;
		}
		break;
	case 0x0F:
		// ObjAffineSet
		var i = this.cpu.gprs[2];
		var sx, sy;
		var theta;
		var offset = this.cpu.gprs[0];
		var destination = this.cpu.gprs[1]
		var diff = this.cpu.gprs[3];
		var a, b, c, d;
		while (i--) {
			// [ sx   0 ]   [ cos(theta)  -sin(theta) ]   [ A B ]
			// [  0  sy ] * [ sin(theta)   cos(theta) ] = [ C D ]
			sx = this.core.mmu.load16(offset) / 256;
			sy = this.core.mmu.load16(offset + 2) / 256;
			theta = (this.core.mmu.loadU16(offset + 4) >> 8) / 128 * Math.PI;
			offset += 6;
			// Rotation
			a = d = Math.cos(theta);
			b = c = Math.sin(theta);
			// Scale
			a *= sx;
			b *= -sx;
			c *= sy;
			d *= sy;
			this.core.mmu.store16(destination, (a * 256) | 0);
			this.core.mmu.store16(destination + diff, (b * 256) | 0);
			this.core.mmu.store16(destination + diff * 2, (c * 256) | 0);
			this.core.mmu.store16(destination + diff * 3, (d * 256) | 0);
			destination += diff * 4;
		}
		break;
	case 0x11:
		// LZ77UnCompWram
		this.lz77(this.cpu.gprs[0], this.cpu.gprs[1], 1);
		break;
	case 0x12:
		// LZ77UnCompVram
		this.lz77(this.cpu.gprs[0], this.cpu.gprs[1], 2);
		break;
	case 0x13:
		// HuffUnComp
		this.huffman(this.cpu.gprs[0], this.cpu.gprs[1]);
		break;
	case 0x14:
		// RlUnCompWram
		this.rl(this.cpu.gprs[0], this.cpu.gprs[1], 1);
		break;
	case 0x15:
		// RlUnCompVram
		this.rl(this.cpu.gprs[0], this.cpu.gprs[1], 2);
		break;
	case 0x1F:
		// MidiKey2Freq
		var key = this.cpu.mmu.load32(this.cpu.gprs[0] + 4);
		this.cpu.gprs[0] = key / Math.pow(2, (180 - this.cpu.gprs[1] - this.cpu.gprs[2] / 256) / 12) >>> 0;
		break;
	default:
		throw "Unimplemented software interrupt: 0x" + opcode.toString(16);
	}
};

GameBoyAdvanceInterruptHandler.prototype.masterEnable = function(value) {
	this.enable = value;

	if (this.enable && this.enabledIRQs & this.interruptFlags) {
		this.cpu.raiseIRQ();
	}
};

GameBoyAdvanceInterruptHandler.prototype.setInterruptsEnabled = function(value) {
	this.enabledIRQs = value;

	if (this.enabledIRQs & this.MASK_SIO) {
		this.core.STUB('Serial I/O interrupts not implemented');
	}

	if (this.enabledIRQs & this.MASK_KEYPAD) {
		this.core.STUB('Keypad interrupts not implemented');
	}

	if (this.enable && this.enabledIRQs & this.interruptFlags) {
		this.cpu.raiseIRQ();
	}
};

GameBoyAdvanceInterruptHandler.prototype.pollNextEvent = function() {
	var nextEvent = this.video.nextEvent;
	var test;

	if (this.audio.enabled) {
		test = this.audio.nextEvent;
		if (!nextEvent || test < nextEvent) {
			nextEvent = test;
		}
	}

	if (this.timersEnabled) {
		var timer = this.timers[0];
		test = timer.nextEvent;
		if (timer.enable && test && (!nextEvent || test < nextEvent)) {
			nextEvent = test;
		}

		timer = this.timers[1];
		test = timer.nextEvent;
		if (timer.enable && test && (!nextEvent || test < nextEvent)) {
			nextEvent = test;
		}
		timer = this.timers[2];
		test = timer.nextEvent;
		if (timer.enable && test && (!nextEvent || test < nextEvent)) {
			nextEvent = test;
		}
		timer = this.timers[3];
		test = timer.nextEvent;
		if (timer.enable && test && (!nextEvent || test < nextEvent)) {
			nextEvent = test;
		}
	}

	var dma = this.dma[0];
	test = dma.nextIRQ;
	if (dma.enable && dma.doIrq && test && (!nextEvent || test < nextEvent)) {
		nextEvent = test;
	}

	dma = this.dma[1];
	test = dma.nextIRQ;
	if (dma.enable && dma.doIrq && test && (!nextEvent || test < nextEvent)) {
		nextEvent = test;
	}

	dma = this.dma[2];
	test = dma.nextIRQ;
	if (dma.enable && dma.doIrq && test && (!nextEvent || test < nextEvent)) {
		nextEvent = test;
	}

	dma = this.dma[3];
	test = dma.nextIRQ;
	if (dma.enable && dma.doIrq && test && (!nextEvent || test < nextEvent)) {
		nextEvent = test;
	}

	this.core.ASSERT(nextEvent >= this.cpu.cycles, "Next event is before present");
	this.nextEvent = nextEvent;
};

GameBoyAdvanceInterruptHandler.prototype.waitForIRQ = function() {
	var timer;
	var irqPending = this.testIRQ() || this.video.hblankIRQ || this.video.vblankIRQ || this.video.vcounterIRQ;
	if (this.timersEnabled) {
		timer = this.timers[0];
		irqPending = irqPending || timer.doIrq;
		timer = this.timers[1];
		irqPending = irqPending || timer.doIrq;
		timer = this.timers[2];
		irqPending = irqPending || timer.doIrq;
		timer = this.timers[3];
		irqPending = irqPending || timer.doIrq;
	}
	if (!irqPending) {
		return false;
	}

	for (;;) {
		this.pollNextEvent();

		if (!this.nextEvent) {
			return false;
		} else {
			this.cpu.cycles = this.nextEvent;
			this.updateTimers();
			if (this.interruptFlags) {
				return true;
			}
		}
	}
};

GameBoyAdvanceInterruptHandler.prototype.testIRQ = function() {
	if (this.enable && this.enabledIRQs & this.interruptFlags) {
		this.springIRQ = true;
		this.nextEvent = this.cpu.cycles;
		return true;
	}
	return false;
};

GameBoyAdvanceInterruptHandler.prototype.raiseIRQ = function(irqType) {
	this.interruptFlags |= 1 << irqType;
	this.io.registers[this.io.IF >> 1] = this.interruptFlags;

	if (this.enable && (this.enabledIRQs & 1 << irqType)) {
		this.cpu.raiseIRQ();
	}
};

GameBoyAdvanceInterruptHandler.prototype.dismissIRQs = function(irqMask) {
	this.interruptFlags &= ~irqMask;
	this.io.registers[this.io.IF >> 1] = this.interruptFlags;
};

GameBoyAdvanceInterruptHandler.prototype.dmaSetSourceAddress = function(dma, address) {
	this.dma[dma].source = address & 0xFFFFFFFE;
};

GameBoyAdvanceInterruptHandler.prototype.dmaSetDestAddress = function(dma, address) {
	this.dma[dma].dest = address & 0xFFFFFFFE;
};

GameBoyAdvanceInterruptHandler.prototype.dmaSetWordCount = function(dma, count) {
	this.dma[dma].count = count ? count : (dma == 3 ? 0x10000 : 0x4000);
};

GameBoyAdvanceInterruptHandler.prototype.dmaWriteControl = function(dma, control) {
	var currentDma = this.dma[dma];
	var wasEnabled = currentDma.enable;
	currentDma.dstControl = (control & 0x0060) >> 5;
	currentDma.srcControl = (control & 0x0180) >> 7;
	currentDma.repeat = !!(control & 0x0200);
	currentDma.width = (control & 0x0400) ? 4 : 2;
	currentDma.drq = !!(control & 0x0800);
	currentDma.timing = (control & 0x3000) >> 12;
	currentDma.doIrq = !!(control & 0x4000);
	currentDma.enable = !!(control & 0x8000);
	currentDma.nextIRQ = 0;

	if (currentDma.drq) {
		this.core.WARN('DRQ not implemented');
	}

	if (!wasEnabled && currentDma.enable) {
		currentDma.nextSource = currentDma.source;
		currentDma.nextDest = currentDma.dest;
		currentDma.nextCount = currentDma.count;
		this.cpu.mmu.scheduleDma(dma, currentDma);
	}
};

GameBoyAdvanceInterruptHandler.prototype.timerSetReload = function(timer, reload) {
	this.timers[timer].reload = reload & 0xFFFF;
};

GameBoyAdvanceInterruptHandler.prototype.timerWriteControl = function(timer, control) {
	var currentTimer = this.timers[timer];
	var oldPrescale = currentTimer.prescaleBits;
	switch (control & 0x0003) {
	case 0x0000:
		currentTimer.prescaleBits = 0;
		break;
	case 0x0001:
		currentTimer.prescaleBits = 6;
		break;
	case 0x0002:
		currentTimer.prescaleBits = 8;
		break;
	case 0x0003:
		currentTimer.prescaleBits = 10;
		break;
	}
	currentTimer.countUp = !!(control & 0x0004);
	currentTimer.doIrq = !!(control & 0x0040);
	currentTimer.overflowInterval = (0x10000 - currentTimer.reload) << currentTimer.prescaleBits;
	var wasEnabled = currentTimer.enable;
	currentTimer.enable = !!(((control & 0x0080) >> 7) << timer);
	if (!wasEnabled && currentTimer.enable) {
		if (!currentTimer.countUp) {
			currentTimer.lastEvent = this.cpu.cycles;
			currentTimer.nextEvent = this.cpu.cycles + currentTimer.overflowInterval;
		} else {
			currentTimer.nextEvent = 0;
		}
		this.io.registers[(this.io.TM0CNT_LO + (timer << 2)) >> 1] = currentTimer.reload;
		currentTimer.oldReload = currentTimer.reload;
		++this.timersEnabled;
	} else if (wasEnabled && !currentTimer.enable) {
		if (!currentTimer.countUp) {
			this.io.registers[(this.io.TM0CNT_LO + (timer << 2)) >> 1] = currentTimer.oldReload + (this.cpu.cycles - currentTimer.lastEvent) >> oldPrescale;
		}
		--this.timersEnabled;
	} else if (currentTimer.prescaleBits != oldPrescale && !currentTimer.countUp) {
		// FIXME: this might be before present
		currentTimer.nextEvent = currentTimer.lastEvent + currentTimer.overflowInterval;
	}

	// We've changed the timers somehow...we need to reset the next event
	this.pollNextEvent();
};

GameBoyAdvanceInterruptHandler.prototype.timerRead = function(timer) {
	var currentTimer = this.timers[timer];
	if (currentTimer.enable && !currentTimer.countUp) {
		return currentTimer.oldReload + (this.cpu.cycles - currentTimer.lastEvent) >> currentTimer.prescaleBits;
	} else {
		return this.io.registers[(this.io.TM0CNT_LO + (timer << 2)) >> 1];
	}
};

GameBoyAdvanceInterruptHandler.prototype.halt = function() {
	if (!this.enable) {
		throw "Requested HALT when interrupts were disabled!";
	}
	if (!this.waitForIRQ()) {
		throw "Waiting on interrupt forever.";
	}
}

GameBoyAdvanceInterruptHandler.prototype.lz77 = function(source, dest, unitsize) {
	// TODO: move to a different file
	var remaining = (this.cpu.mmu.load32(source) & 0xFFFFFF00) >> 8;
	// We assume the signature byte (0x10) is correct
	var blockheader;
	var sPointer = source + 4;
	var dPointer = dest;
	var blocksRemaining = 0;
	var block;
	var disp;
	var bytes;
	var buffer = 0;
	var loaded;
	while (remaining > 0) {
		if (blocksRemaining) {
			if (blockheader & 0x80) {
				// Compressed
				block = this.cpu.mmu.loadU8(sPointer) | (this.cpu.mmu.loadU8(sPointer + 1) << 8);
				sPointer += 2;
				disp = dPointer - (((block & 0x000F) << 8) | ((block & 0xFF00) >> 8)) - 1;
				bytes = ((block & 0x00F0) >> 4) + 3;
				while (bytes-- && remaining) {
					loaded = this.cpu.mmu.loadU8(disp++);
					if (unitsize == 2) {
						buffer >>= 8;
						buffer |= loaded << 8;
						if (dPointer & 1) {
							this.cpu.mmu.store16(dPointer - 1, buffer);
						}
					} else {
						this.cpu.mmu.store8(dPointer, loaded);
					}
					--remaining;
					++dPointer;
				}
			} else {
				// Uncompressed
				loaded = this.cpu.mmu.loadU8(sPointer++);
				if (unitsize == 2) {
					buffer >>= 8;
					buffer |= loaded << 8;
					if (dPointer & 1) {
						this.cpu.mmu.store16(dPointer - 1, buffer);
					}
				} else {
					this.cpu.mmu.store8(dPointer, loaded);
				}
				--remaining;
				++dPointer;
			}
			blockheader <<= 1;
			--blocksRemaining;
		} else {
			blockheader = this.cpu.mmu.loadU8(sPointer++);
			blocksRemaining = 8;
		}
	}
};

GameBoyAdvanceInterruptHandler.prototype.huffman = function(source, dest) {
	source = source & 0xFFFFFFFC;
	var header = this.cpu.mmu.load32(source);
	var remaining = header >> 8;
	var bits = header & 0xF;
	if (32 % bits) {
		throw 'Unimplemented unaligned Huffman';
	}
	var padding = (4 - remaining) & 0x3;
	remaining &= 0xFFFFFFFC;
	// We assume the signature byte (0x20) is correct
	var tree = [];
	var treesize = (this.cpu.mmu.loadU8(source + 4) << 1) + 1;
	var block;
	var sPointer = source + 5 + treesize;
	var dPointer = dest & 0xFFFFFFFC;
	var i;
	for (i = 0; i < treesize; ++i) {
		tree.push(this.cpu.mmu.loadU8(source + 5 + i));
	}
	var node;
	var offset = 0;
	var bitsRemaining;
	var readBits;
	var bitsSeen = 0;
	node = tree[0];
	while (remaining > 0) {
		var bitstream = this.cpu.mmu.load32(sPointer);
		sPointer += 4;
		for (bitsRemaining = 32; bitsRemaining > 0; --bitsRemaining, bitstream <<= 1) {
			if (typeof (node) === 'number') {
				// Lazily construct tree
				var next = (offset - 1 | 1) + ((node & 0x3F) << 1) + 2;
				node = {
					l: next,
					r: next + 1,
					lTerm: node & 0x80,
					rTerm: node & 0x40
				};
				tree[offset] = node;
			}

			if (bitstream & 0x80000000) {
				// Go right
				if (node.rTerm) {
					readBits = tree[node.r];
				} else {
					offset = node.r;
					node = tree[node.r];
					continue;
				}
			} else {
				// Go left
				if (node.lTerm) {
					readBits = tree[node.l];
				} else {
					offset = node.l;
					node = tree[offset];
					continue;
				}
			}

			block |= (readBits & ((1 << bits) - 1)) << bitsSeen;
			bitsSeen += bits;
			offset = 0;
			node = tree[0];
			if (bitsSeen == 32) {
				bitsSeen = 0;
				this.cpu.mmu.store32(dPointer, block);
				dPointer += 4;
				remaining -= 4;
				block = 0;
			}
		}

	}
	if (padding) {
		this.cpu.mmu.store32(dPointer, block);
	}
};

GameBoyAdvanceInterruptHandler.prototype.rl = function(source, dest, unitsize) {
	source = source & 0xFFFFFFFC;
	var remaining = (this.cpu.mmu.load32(source) & 0xFFFFFF00) >> 8;
	var padding = (4 - remaining) & 0x3;
	// We assume the signature byte (0x30) is correct
	var blockheader;
	var block;
	var sPointer = source + 4;
	var dPointer = dest;
	var buffer = 0;
	while (remaining > 0) {
		blockheader = this.cpu.mmu.loadU8(sPointer++);
		if (blockheader & 0x80) {
			// Compressed
			blockheader &= 0x7F;
			blockheader += 3;
			block = this.cpu.mmu.loadU8(sPointer++);
			while (blockheader-- && remaining) {
				--remaining;
				if (unitsize == 2) {
					buffer >>= 8;
					buffer |= block << 8;
					if (dPointer & 1) {
						this.cpu.mmu.store16(dPointer - 1, buffer);
					}
				} else {
					this.cpu.mmu.store8(dPointer, block);
				}
				++dPointer;
			}
		} else {
			// Uncompressed
			blockheader++;
			while (blockheader-- && remaining) {
				--remaining;
				block = this.cpu.mmu.loadU8(sPointer++);
				if (unitsize == 2) {
					buffer >>= 8;
					buffer |= block << 8;
					if (dPointer & 1) {
						this.cpu.mmu.store16(dPointer - 1, buffer);
					}
				} else {
					this.cpu.mmu.store8(dPointer, block);
				}
				++dPointer;
			}
		}
	}
	while (padding--) {
		this.cpu.mmu.store8(dPointer++, 0);
	}
};
