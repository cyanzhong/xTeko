function GameBoyAdvanceIO() {
	// Video
	this.DISPCNT = 0x000;
	this.GREENSWP = 0x002;
	this.DISPSTAT = 0x004;
	this.VCOUNT = 0x006;
	this.BG0CNT = 0x008;
	this.BG1CNT = 0x00A;
	this.BG2CNT = 0x00C;
	this.BG3CNT = 0x00E;
	this.BG0HOFS = 0x010;
	this.BG0VOFS = 0x012;
	this.BG1HOFS = 0x014;
	this.BG1VOFS = 0x016;
	this.BG2HOFS = 0x018;
	this.BG2VOFS = 0x01A;
	this.BG3HOFS = 0x01C;
	this.BG3VOFS = 0x01E;
	this.BG2PA = 0x020;
	this.BG2PB = 0x022;
	this.BG2PC = 0x024;
	this.BG2PD = 0x026;
	this.BG2X_LO = 0x028;
	this.BG2X_HI = 0x02A;
	this.BG2Y_LO = 0x02C;
	this.BG2Y_HI = 0x02E;
	this.BG3PA = 0x030;
	this.BG3PB = 0x032;
	this.BG3PC = 0x034;
	this.BG3PD = 0x036;
	this.BG3X_LO = 0x038;
	this.BG3X_HI = 0x03A;
	this.BG3Y_LO = 0x03C;
	this.BG3Y_HI = 0x03E;
	this.WIN0H = 0x040;
	this.WIN1H = 0x042;
	this.WIN0V = 0x044;
	this.WIN1V = 0x046;
	this.WININ = 0x048;
	this.WINOUT = 0x04A;
	this.MOSAIC = 0x04C;
	this.BLDCNT = 0x050;
	this.BLDALPHA = 0x052;
	this.BLDY = 0x054;

	// Sound
	this.SOUND1CNT_LO = 0x060;
	this.SOUND1CNT_HI = 0x062;
	this.SOUND1CNT_X = 0x064;
	this.SOUND2CNT_LO = 0x068;
	this.SOUND2CNT_HI = 0x06C;
	this.SOUND3CNT_LO = 0x070;
	this.SOUND3CNT_HI = 0x072;
	this.SOUND3CNT_X = 0x074;
	this.SOUND4CNT_LO = 0x078;
	this.SOUND4CNT_HI = 0x07C;
	this.SOUNDCNT_LO = 0x080;
	this.SOUNDCNT_HI = 0x082;
	this.SOUNDCNT_X = 0x084;
	this.SOUNDBIAS = 0x088;
	this.WAVE_RAM0_LO = 0x090;
	this.WAVE_RAM0_HI = 0x092;
	this.WAVE_RAM1_LO = 0x094;
	this.WAVE_RAM1_HI = 0x096;
	this.WAVE_RAM2_LO = 0x098;
	this.WAVE_RAM2_HI = 0x09A;
	this.WAVE_RAM3_LO = 0x09C;
	this.WAVE_RAM3_HI = 0x09E;
	this.FIFO_A_LO = 0x0A0;
	this.FIFO_A_HI = 0x0A2;
	this.FIFO_B_LO = 0x0A4;
	this.FIFO_B_HI = 0x0A6;

	// DMA
	this.DMA0SAD_LO = 0x0B0;
	this.DMA0SAD_HI = 0x0B2;
	this.DMA0DAD_LO = 0x0B4;
	this.DMA0DAD_HI = 0x0B6;
	this.DMA0CNT_LO = 0x0B8;
	this.DMA0CNT_HI = 0x0BA;
	this.DMA1SAD_LO = 0x0BC;
	this.DMA1SAD_HI = 0x0BE;
	this.DMA1DAD_LO = 0x0C0;
	this.DMA1DAD_HI = 0x0C2;
	this.DMA1CNT_LO = 0x0C4;
	this.DMA1CNT_HI = 0x0C6;
	this.DMA2SAD_LO = 0x0C8;
	this.DMA2SAD_HI = 0x0CA;
	this.DMA2DAD_LO = 0x0CC;
	this.DMA2DAD_HI = 0x0CE;
	this.DMA2CNT_LO = 0x0D0;
	this.DMA2CNT_HI = 0x0D2;
	this.DMA3SAD_LO = 0x0D4;
	this.DMA3SAD_HI = 0x0D6;
	this.DMA3DAD_LO = 0x0D8;
	this.DMA3DAD_HI = 0x0DA;
	this.DMA3CNT_LO = 0x0DC;
	this.DMA3CNT_HI = 0x0DE;

	// Timers
	this.TM0CNT_LO = 0x100;
	this.TM0CNT_HI = 0x102;
	this.TM1CNT_LO = 0x104;
	this.TM1CNT_HI = 0x106;
	this.TM2CNT_LO = 0x108;
	this.TM2CNT_HI = 0x10A;
	this.TM3CNT_LO = 0x10C;
	this.TM3CNT_HI = 0x10E;

	// SIO (note: some of these are repeated)
	this.SIODATA32 = 0x120;
	this.SIOMULTI0 = 0x120;
	this.SIOMULTI1 = 0x122;
	this.SIOMULTI2 = 0x124;
	this.SIOMULTI3 = 0x126;
	this.SIOCNT = 0x128;
	this.SIOMLT_SEND = 0x12A;
	this.SIODATA8 = 0x12A;
	this.RCNT = 0x134;
	this.JOYCNT = 0x140;
	this.JOY_RECV = 0x150;
	this.JOY_TRANS = 0x154;
	this.JOYSTAT = 0x158;

	// Keypad
	this.KEYINPUT = 0x130;
	this.KEYCNT = 0x132;

	// Interrupts, etc
	this.IE = 0x200;
	this.IF = 0x202;
	this.WAITCNT = 0x204;
	this.IME = 0x208;

	this.POSTFLG = 0x300;
	this.HALTCNT = 0x301;

	this.DEFAULT_DISPCNT = 0x0080;
	this.DEFAULT_SOUNDBIAS = 0x200;
	this.DEFAULT_BGPA = 1;
	this.DEFAULT_BGPD = 1;
};

GameBoyAdvanceIO.prototype.setCPU = function(cpu) {
	this.cpu = cpu;
};

GameBoyAdvanceIO.prototype.setVideo = function(video) {
	this.video = video;
};

GameBoyAdvanceIO.prototype.clear = function() {
	this.registers = new Uint16Array(this.cpu.mmu.SIZE_IO);

	this.registers[this.DISPCNT >> 1] = this.DEFAULT_DISPCNT;
	this.registers[this.SOUNDBIAS >> 1] = this.DEFAULT_SOUNDBIAS;
	this.registers[this.BG2PA >> 1] = this.DEFAULT_BGPA;
	this.registers[this.BG2PD >> 1] = this.DEFAULT_BGPD;
	this.registers[this.BG3PA >> 1] = this.DEFAULT_BGPA;
	this.registers[this.BG3PD >> 1] = this.DEFAULT_BGPD;
};

GameBoyAdvanceIO.prototype.load8 = function(offset) {
	throw 'Unimplmeneted unaligned I/O access';
}

GameBoyAdvanceIO.prototype.load16 = function(offset) {
	return (this.loadU16(offset) << 16) >> 16;
}

GameBoyAdvanceIO.prototype.load32 = function(offset) {
	offset &= 0xFFFFFFFC;
	switch (offset) {
	case this.DMA0CNT_LO:
	case this.DMA1CNT_LO:
	case this.DMA2CNT_LO:
	case this.DMA3CNT_LO:
		return this.loadU16(offset | 2) << 16;
	case this.IME:
		return this.loadU16(offset) & 0xFFFF;
	case this.JOY_RECV:
	case this.JOY_TRANS:
 		this.core.STUB('Unimplemented JOY register read: 0x' + offset.toString(16));
 		return 0;
	}

	return this.loadU16(offset) | (this.loadU16(offset | 2) << 16);
};

GameBoyAdvanceIO.prototype.loadU8 = function(offset) {
	var odd = offset & 0x0001;
	var value = this.loadU16(offset & 0xFFFE);
	return (value >>> (odd << 3)) & 0xFF;
}

GameBoyAdvanceIO.prototype.loadU16 = function(offset) {
	switch (offset) {
	case this.DISPCNT:
	case this.BG0CNT:
	case this.BG1CNT:
	case this.BG2CNT:
	case this.BG3CNT:
	case this.WININ:
	case this.WINOUT:
	case this.SOUND1CNT_LO:
	case this.SOUND3CNT_LO:
	case this.SOUNDCNT_LO:
	case this.SOUNDCNT_HI:
	case this.SOUNDBIAS:
	case this.BLDCNT:
	case this.BLDALPHA:

	case this.TM0CNT_HI:
	case this.TM1CNT_HI:
	case this.TM2CNT_HI:
	case this.TM3CNT_HI:
	case this.DMA0CNT_HI:
	case this.DMA1CNT_HI:
	case this.DMA2CNT_HI:
	case this.DMA3CNT_HI:
	case this.WAITCNT:
	case this.IE:
	case this.IF:
	case this.IME:
	case this.POSTFLG:
		// Handled transparently by the written registers
		break;

	// Video
	case this.DISPSTAT:
		return this.registers[offset >> 1] | this.video.readDisplayStat();
	case this.VCOUNT:
		return this.video.vcount;

	// Sound
	case this.SOUND1CNT_HI:
	case this.SOUND2CNT_LO:
		return this.registers[offset >> 1] & 0xFFC0;
	case this.SOUND1CNT_X:
	case this.SOUND2CNT_HI:
	case this.SOUND3CNT_X:
		return this.registers[offset >> 1] & 0x4000;
	case this.SOUND3CNT_HI:
		return this.registers[offset >> 1] & 0xE000;
	case this.SOUND4CNT_LO:
		return this.registers[offset >> 1] & 0xFF00;
	case this.SOUND4CNT_HI:
		return this.registers[offset >> 1] & 0x40FF;
	case this.SOUNDCNT_X:
		this.core.STUB('Unimplemented sound register read: SOUNDCNT_X');
		return this.registers[offset >> 1] | 0x0000;

	// Timers
	case this.TM0CNT_LO:
		return this.cpu.irq.timerRead(0);
	case this.TM1CNT_LO:
		return this.cpu.irq.timerRead(1);
	case this.TM2CNT_LO:
		return this.cpu.irq.timerRead(2);
	case this.TM3CNT_LO:
		return this.cpu.irq.timerRead(3);

	case this.RCNT:
		this.core.STUB('Reading from unimplemented RCNT');
		return 0x8000;
	case this.SIOCNT:
		this.core.STUB('Reading from unimplemented SIOCNT');
		return 0;

	case this.KEYINPUT:
		return this.keypad.currentDown;
	case this.KEYCNT:
		this.core.STUB('Unimplemented I/O register read: KEYCNT');
		return 0;

	case this.BG0HOFS:
	case this.BG0VOFS:
	case this.BG1HOFS:
	case this.BG1VOFS:
	case this.BG2HOFS:
	case this.BG2VOFS:
	case this.BG3HOFS:
	case this.BG3VOFS:
	case this.BG2PA:
	case this.BG2PB:
	case this.BG2PC:
	case this.BG2PD:
	case this.BG3PA:
	case this.BG3PB:
	case this.BG3PC:
	case this.BG3PD:
	case this.BG2X_LO:
	case this.BG2X_HI:
	case this.BG2Y_LO:
	case this.BG2Y_HI:
	case this.BG3X_LO:
	case this.BG3X_HI:
	case this.BG3Y_LO:
	case this.BG3Y_HI:
	case this.WIN0H:
	case this.WIN1H:
	case this.WIN0V:
	case this.WIN1V:
	case this.BLDY:
	case this.DMA0SAD_LO:
	case this.DMA0SAD_HI:
	case this.DMA0DAD_LO:
	case this.DMA0DAD_HI:
	case this.DMA0CNT_LO:
	case this.DMA1SAD_LO:
	case this.DMA1SAD_HI:
	case this.DMA1DAD_LO:
	case this.DMA1DAD_HI:
	case this.DMA1CNT_LO:
	case this.DMA2SAD_LO:
	case this.DMA2SAD_HI:
	case this.DMA2DAD_LO:
	case this.DMA2DAD_HI:
	case this.DMA2CNT_LO:
	case this.DMA3SAD_LO:
	case this.DMA3SAD_HI:
	case this.DMA3DAD_LO:
	case this.DMA3DAD_HI:
	case this.DMA3CNT_LO:
	case this.FIFO_A_LO:
	case this.FIFO_A_HI:
	case this.FIFO_B_LO:
	case this.FIFO_B_HI:
		this.core.WARN('Read for write-only register: 0x' + offset.toString(16));
		return this.core.mmu.badMemory.loadU16(0);

	case this.MOSAIC:
		this.core.WARN('Read for write-only register: 0x' + offset.toString(16));
		return 0;

	case this.SIOMULTI0:
 	case this.SIOMULTI1:
 	case this.SIOMULTI2:
 	case this.SIOMULTI3:
 	case this.SIODATA8:
 		this.core.STUB('Unimplemented SIO register read: 0x' + offset.toString(16));
 		return 0;
	case this.JOYCNT:
	case this.JOYSTAT:
 		this.core.STUB('Unimplemented JOY register read: 0x' + offset.toString(16));
 		return 0;

	default:
		this.core.WARN('Bad I/O register read: 0x' + offset.toString(16));
		return this.core.mmu.badMemory.loadU16(0);
	}
	return this.registers[offset >> 1];
};

GameBoyAdvanceIO.prototype.store8 = function(offset, value) {
	switch (offset) {
	case this.WININ:
		this.value & 0x3F;
		break;
	case this.WININ | 1:
		this.value & 0x3F;
		break;
	case this.WINOUT:
		this.value & 0x3F;
		break;
	case this.WINOUT | 1:
		this.value & 0x3F;
		break;
	case this.SOUND1CNT_LO:
	case this.SOUND1CNT_LO | 1:
	case this.SOUND1CNT_HI:
	case this.SOUND1CNT_HI | 1:
	case this.SOUND1CNT_X:
	case this.SOUND1CNT_X | 1:
	case this.SOUND2CNT_LO:
	case this.SOUND2CNT_LO | 1:
	case this.SOUND2CNT_HI:
	case this.SOUND2CNT_HI | 1:
	case this.SOUND3CNT_LO:
	case this.SOUND3CNT_LO | 1:
	case this.SOUND3CNT_HI:
	case this.SOUND3CNT_HI | 1:
	case this.SOUND3CNT_X:
	case this.SOUND3CNT_X | 1:
	case this.SOUND4CNT_LO:
	case this.SOUND4CNT_LO | 1:
	case this.SOUND4CNT_HI:
	case this.SOUND4CNT_HI | 1:
	case this.SOUNDCNT_LO:
	case this.SOUNDCNT_LO | 1:
	case this.SOUNDCNT_X:
	case this.IF:
	case this.IME:
		break;
	case this.SOUNDBIAS | 1:
		this.STUB_REG('sound', offset);
		break;
	case this.HALTCNT:
		value &= 0x80;
		if (!value) {
			this.core.irq.halt();
		} else {
			this.core.STUB('Stop');
		}
		return;
	default:
		this.STUB_REG('8-bit I/O', offset);
		break;
	}

	if (offset & 1) {
		value <<= 8;
		value |= (this.registers[offset >> 1] & 0x00FF);
	} else {
		value &= 0x00FF;
		value |= (this.registers[offset >> 1] & 0xFF00);
	}
	this.store16(offset & 0xFFFFFFE, value);
};

GameBoyAdvanceIO.prototype.store16 = function(offset, value) {
	switch (offset) {
	// Video
	case this.DISPCNT:
		this.video.renderPath.writeDisplayControl(value);
		break;
	case this.DISPSTAT:
		value &= this.video.DISPSTAT_MASK;
		this.video.writeDisplayStat(value);
		break;
	case this.BG0CNT:
		this.video.renderPath.writeBackgroundControl(0, value);
		break;
	case this.BG1CNT:
		this.video.renderPath.writeBackgroundControl(1, value);
		break;
	case this.BG2CNT:
		this.video.renderPath.writeBackgroundControl(2, value);
		break;
	case this.BG3CNT:
		this.video.renderPath.writeBackgroundControl(3, value);
		break;
	case this.BG0HOFS:
		this.video.renderPath.writeBackgroundHOffset(0, value);
		break;
	case this.BG0VOFS:
		this.video.renderPath.writeBackgroundVOffset(0, value);
		break;
	case this.BG1HOFS:
		this.video.renderPath.writeBackgroundHOffset(1, value);
		break;
	case this.BG1VOFS:
		this.video.renderPath.writeBackgroundVOffset(1, value);
		break;
	case this.BG2HOFS:
		this.video.renderPath.writeBackgroundHOffset(2, value);
		break;
	case this.BG2VOFS:
		this.video.renderPath.writeBackgroundVOffset(2, value);
		break;
	case this.BG3HOFS:
		this.video.renderPath.writeBackgroundHOffset(3, value);
		break;
	case this.BG3VOFS:
		this.video.renderPath.writeBackgroundVOffset(3, value);
		break;
	case this.BG2X_LO:
		this.video.renderPath.writeBackgroundRefX(2, (this.registers[(offset >> 1) | 1] << 16) | value);
		break;
	case this.BG2X_HI:
		this.video.renderPath.writeBackgroundRefX(2, this.registers[(offset >> 1) ^ 1] | (value << 16));
		break;
	case this.BG2Y_LO:
		this.video.renderPath.writeBackgroundRefY(2, (this.registers[(offset >> 1) | 1] << 16) | value);
		break;
	case this.BG2Y_HI:
		this.video.renderPath.writeBackgroundRefY(2, this.registers[(offset >> 1) ^ 1] | (value << 16));
		break;
	case this.BG2PA:
		this.video.renderPath.writeBackgroundParamA(2, value);
		break;
	case this.BG2PB:
		this.video.renderPath.writeBackgroundParamB(2, value);
		break;
	case this.BG2PC:
		this.video.renderPath.writeBackgroundParamC(2, value);
		break;
	case this.BG2PD:
		this.video.renderPath.writeBackgroundParamD(2, value);
		break;
	case this.BG3X_LO:
		this.video.renderPath.writeBackgroundRefX(3, (this.registers[(offset >> 1) | 1] << 16) | value);
		break;
	case this.BG3X_HI:
		this.video.renderPath.writeBackgroundRefX(3, this.registers[(offset >> 1) ^ 1] | (value << 16));
		break;
	case this.BG3Y_LO:
		this.video.renderPath.writeBackgroundRefY(3, (this.registers[(offset >> 1) | 1] << 16) | value);
		break;
	case this.BG3Y_HI:
		this.video.renderPath.writeBackgroundRefY(3, this.registers[(offset >> 1) ^ 1] | (value << 16));
		break;
	case this.BG3PA:
		this.video.renderPath.writeBackgroundParamA(3, value);
		break;
	case this.BG3PB:
		this.video.renderPath.writeBackgroundParamB(3, value);
		break;
	case this.BG3PC:
		this.video.renderPath.writeBackgroundParamC(3, value);
		break;
	case this.BG3PD:
		this.video.renderPath.writeBackgroundParamD(3, value);
		break;
	case this.WIN0H:
		this.video.renderPath.writeWin0H(value);
		break;
	case this.WIN1H:
		this.video.renderPath.writeWin1H(value);
		break;
	case this.WIN0V:
		this.video.renderPath.writeWin0V(value);
		break;
	case this.WIN1V:
		this.video.renderPath.writeWin1V(value);
		break;
	case this.WININ:
		value &= 0x3F3F;
		this.video.renderPath.writeWinIn(value);
		break;
	case this.WINOUT:
		value &= 0x3F3F;
		this.video.renderPath.writeWinOut(value);
		break;
	case this.BLDCNT:
		value &= 0x7FFF;
		this.video.renderPath.writeBlendControl(value);
		break;
	case this.BLDALPHA:
		value &= 0x1F1F;
		this.video.renderPath.writeBlendAlpha(value);
		break;
	case this.BLDY:
		value &= 0x001F;
		this.video.renderPath.writeBlendY(value);
		break;
	case this.MOSAIC:
		this.video.renderPath.writeMosaic(value);
		break;

	// Sound
	case this.SOUND1CNT_LO:
		value &= 0x007F;
		this.audio.writeSquareChannelSweep(0, value);
		break;
	case this.SOUND1CNT_HI:
		this.audio.writeSquareChannelDLE(0, value);
		break;
	case this.SOUND1CNT_X:
		value &= 0xC7FF;
		this.audio.writeSquareChannelFC(0, value);
		value &= ~0x8000;
		break;
	case this.SOUND2CNT_LO:
		this.audio.writeSquareChannelDLE(1, value);
		break;
	case this.SOUND2CNT_HI:
		value &= 0xC7FF;
		this.audio.writeSquareChannelFC(1, value);
		value &= ~0x8000;
		break;
	case this.SOUND3CNT_LO:
		value &= 0x00E0;
		this.audio.writeChannel3Lo(value);
		break;
	case this.SOUND3CNT_HI:
		value &= 0xE0FF;
		this.audio.writeChannel3Hi(value);
		break;
	case this.SOUND3CNT_X:
		value &= 0xC7FF;
		this.audio.writeChannel3X(value);
		value &= ~0x8000;
		break;
	case this.SOUND4CNT_LO:
		value &= 0xFF3F;
		this.audio.writeChannel4LE(value);
		break;
	case this.SOUND4CNT_HI:
		value &= 0xC0FF;
		this.audio.writeChannel4FC(value);
		value &= ~0x8000;
		break;
	case this.SOUNDCNT_LO:
		value &= 0xFF77;
		this.audio.writeSoundControlLo(value);
		break;
	case this.SOUNDCNT_HI:
		value &= 0xFF0F;
		this.audio.writeSoundControlHi(value);
		break;
	case this.SOUNDCNT_X:
		value &= 0x0080;
		this.audio.writeEnable(value);
		break;
	case this.WAVE_RAM0_LO:
	case this.WAVE_RAM0_HI:
	case this.WAVE_RAM1_LO:
	case this.WAVE_RAM1_HI:
	case this.WAVE_RAM2_LO:
	case this.WAVE_RAM2_HI:
	case this.WAVE_RAM3_LO:
	case this.WAVE_RAM3_HI:
		this.audio.writeWaveData(offset - this.WAVE_RAM0_LO, value, 2);
		break;

	// DMA
	case this.DMA0SAD_LO:
	case this.DMA0DAD_LO:
	case this.DMA1SAD_LO:
	case this.DMA1DAD_LO:
	case this.DMA2SAD_LO:
	case this.DMA2DAD_LO:
	case this.DMA3SAD_LO:
	case this.DMA3DAD_LO:
		this.store32(offset, (this.registers[(offset >> 1) + 1] << 16) | value);
		return;

	case this.DMA0SAD_HI:
	case this.DMA0DAD_HI:
	case this.DMA1SAD_HI:
	case this.DMA1DAD_HI:
	case this.DMA2SAD_HI:
	case this.DMA2DAD_HI:
	case this.DMA3SAD_HI:
	case this.DMA3DAD_HI:
		this.store32(offset - 2, this.registers[(offset >> 1) - 1] | (value << 16));
		return;

	case this.DMA0CNT_LO:
		this.cpu.irq.dmaSetWordCount(0, value);
		break;
	case this.DMA0CNT_HI:
		// The DMA registers need to set the values before writing the control, as writing the
		// control can synchronously trigger a DMA transfer
		this.registers[offset >> 1] = value & 0xFFE0;
		this.cpu.irq.dmaWriteControl(0, value);
		return;
	case this.DMA1CNT_LO:
		this.cpu.irq.dmaSetWordCount(1, value);
		break;
	case this.DMA1CNT_HI:
		this.registers[offset >> 1] = value & 0xFFE0;
		this.cpu.irq.dmaWriteControl(1, value);
		return;
	case this.DMA2CNT_LO:
		this.cpu.irq.dmaSetWordCount(2, value);
		break;
	case this.DMA2CNT_HI:
		this.registers[offset >> 1] = value & 0xFFE0;
		this.cpu.irq.dmaWriteControl(2, value);
		return;
	case this.DMA3CNT_LO:
		this.cpu.irq.dmaSetWordCount(3, value);
		break;
	case this.DMA3CNT_HI:
		this.registers[offset >> 1] = value & 0xFFE0;
		this.cpu.irq.dmaWriteControl(3, value);
		return;

	// Timers
	case this.TM0CNT_LO:
		this.cpu.irq.timerSetReload(0, value);
		return;
	case this.TM1CNT_LO:
		this.cpu.irq.timerSetReload(1, value);
		return;
	case this.TM2CNT_LO:
		this.cpu.irq.timerSetReload(2, value);
		return;
	case this.TM3CNT_LO:
		this.cpu.irq.timerSetReload(3, value);
		return;

	case this.TM0CNT_HI:
		value &= 0x00C7
		this.cpu.irq.timerWriteControl(0, value);
		break;
	case this.TM1CNT_HI:
		value &= 0x00C7
		this.cpu.irq.timerWriteControl(1, value);
		break;
	case this.TM2CNT_HI:
		value &= 0x00C7
		this.cpu.irq.timerWriteControl(2, value);
		break;
	case this.TM3CNT_HI:
		value &= 0x00C7
		this.cpu.irq.timerWriteControl(3, value);
		break;

	// SIO
	case this.SIOMULTI0:
 	case this.SIOMULTI1:
 	case this.SIOMULTI2:
 	case this.SIOMULTI3:
 	case this.SIODATA8:
 		this.STUB_REG('SIO', offset);
 		break;
	case this.RCNT:
		this.STUB_REG('RCNT', offset);
		break;
	case this.SIOCNT:
		this.STUB_REG('SIOCNT', offset);
		break;
	case this.JOYCNT:
	case this.JOYSTAT:
		this.STUB_REG('JOY', offset);
		break;

	// Misc
	case this.IE:
		value &= 0x3FFF;
		this.cpu.irq.setInterruptsEnabled(value);
		break;
	case this.IF:
		this.cpu.irq.dismissIRQs(value);
		return;
	case this.WAITCNT:
		value &= 0xDFFF;
		this.cpu.mmu.adjustTimings(value);
		break;
	case this.IME:
		value &= 0x0001;
		this.cpu.irq.masterEnable(value);
		break;
	default:
		this.STUB_REG('I/O', offset);
	}
	this.registers[offset >> 1] = value;
};

GameBoyAdvanceIO.prototype.store32 = function(offset, value) {
	switch (offset) {
	case this.BG2X_LO:
		value &= 0x0FFFFFFF;
		this.video.renderPath.writeBackgroundRefX(2, value);
		break;
	case this.BG2Y_LO:
		value &= 0x0FFFFFFF;
		this.video.renderPath.writeBackgroundRefY(2, value);
		break;
	case this.BG3X_LO:
		value &= 0x0FFFFFFF;
		this.video.renderPath.writeBackgroundRefX(3, value);
		break;
	case this.BG3Y_LO:
		value &= 0x0FFFFFFF;
		this.video.renderPath.writeBackgroundRefY(3, value);
		break;
	case this.DMA0SAD_LO:
		this.cpu.irq.dmaSetSourceAddress(0, value);
		break;
	case this.DMA0DAD_LO:
		this.cpu.irq.dmaSetDestAddress(0, value);
		break;
	case this.DMA1SAD_LO:
		this.cpu.irq.dmaSetSourceAddress(1, value);
		break;
	case this.DMA1DAD_LO:
		this.cpu.irq.dmaSetDestAddress(1, value);
		break;
	case this.DMA2SAD_LO:
		this.cpu.irq.dmaSetSourceAddress(2, value);
		break;
	case this.DMA2DAD_LO:
		this.cpu.irq.dmaSetDestAddress(2, value);
		break;
	case this.DMA3SAD_LO:
		this.cpu.irq.dmaSetSourceAddress(3, value);
		break;
	case this.DMA3DAD_LO:
		this.cpu.irq.dmaSetDestAddress(3, value);
		break;
	case this.FIFO_A_LO:
		this.audio.appendToFifoA(value);
		return;
	case this.FIFO_B_LO:
		this.audio.appendToFifoB(value);
		return;

	// High bits of this write should be ignored
	case this.IME:
		this.store16(offset, value & 0xFFFF);
		return;
	case this.JOY_RECV:
	case this.JOY_TRANS:
		this.STUB_REG('JOY', offset);
		return;
	default:
		this.store16(offset, value & 0xFFFF);
		this.store16(offset | 2, value >>> 16);
		return;
	}

	this.registers[offset >> 1] = value & 0xFFFF;
	this.registers[(offset >> 1) + 1] = value >>> 16;
};

GameBoyAdvanceIO.prototype.invalidatePage = function(address) {};

GameBoyAdvanceIO.prototype.STUB_REG = function(type, offset) {
	this.core.STUB('Unimplemented ' + type + ' register write: ' + offset.toString(16));
};
