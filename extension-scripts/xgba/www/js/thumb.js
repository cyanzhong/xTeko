ARMCoreThumb = function (cpu) {
	this.cpu = cpu;
};

ARMCoreThumb.prototype.constructADC = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var m = (gprs[rm] >>> 0) + !!cpu.cpsrC;
		var oldD = gprs[rd];
		var d = (oldD >>> 0) + m;
		var oldDn = oldD >> 31;
		var dn = d >> 31;
		var mn = m >> 31;
		cpu.cpsrN = dn;
		cpu.cpsrZ = !(d & 0xFFFFFFFF);
		cpu.cpsrC = d > 0xFFFFFFFF;
		cpu.cpsrV = oldDn == mn && oldDn != dn && mn != dn;
		gprs[rd] = d;
	};
};

ARMCoreThumb.prototype.constructADD1 = function(rd, rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var d = (gprs[rn] >>> 0) + immediate;
		cpu.cpsrN = d >> 31;
		cpu.cpsrZ = !(d & 0xFFFFFFFF);
		cpu.cpsrC = d > 0xFFFFFFFF;
		cpu.cpsrV = !(gprs[rn] >> 31) && ((gprs[rn] >> 31 ^ d) >> 31) && (d >> 31);
		gprs[rd] = d;
	};
};

ARMCoreThumb.prototype.constructADD2 = function(rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var d = (gprs[rn] >>> 0) + immediate;
		cpu.cpsrN = d >> 31;
		cpu.cpsrZ = !(d & 0xFFFFFFFF);
		cpu.cpsrC = d > 0xFFFFFFFF;
		cpu.cpsrV = !(gprs[rn] >> 31) && ((gprs[rn] ^ d) >> 31) && ((immediate ^ d) >> 31);
		gprs[rn] = d;
	};
};

ARMCoreThumb.prototype.constructADD3 = function(rd, rn, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var d = (gprs[rn] >>> 0) + (gprs[rm] >>> 0);
		cpu.cpsrN = d >> 31;
		cpu.cpsrZ = !(d & 0xFFFFFFFF);
		cpu.cpsrC = d > 0xFFFFFFFF;
		cpu.cpsrV = !((gprs[rn] ^ gprs[rm]) >> 31) && ((gprs[rn] ^ d) >> 31) && ((gprs[rm] ^ d) >> 31);
		gprs[rd] = d;
	};
};

ARMCoreThumb.prototype.constructADD4 = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] += gprs[rm];
	};
};

ARMCoreThumb.prototype.constructADD5 = function(rd, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = (gprs[cpu.PC] & 0xFFFFFFFC) + immediate;
	};
};

ARMCoreThumb.prototype.constructADD6 = function(rd, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = gprs[cpu.SP] + immediate;
	};
};

ARMCoreThumb.prototype.constructADD7 = function(immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[cpu.SP] += immediate;
	};
};

ARMCoreThumb.prototype.constructAND = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = gprs[rd] & gprs[rm];
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructASR1 = function(rd, rm, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		if (immediate == 0) {
			cpu.cpsrC = gprs[rm] >> 31;
			if (cpu.cpsrC) {
				gprs[rd] = 0xFFFFFFFF;
			} else {
				gprs[rd] = 0;
			}
		} else {
			cpu.cpsrC = gprs[rm] & (1 << (immediate - 1));
			gprs[rd] = gprs[rm] >> immediate;
		}
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructASR2 = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var rs = gprs[rm] & 0xFF;
		if (rs) {
			if (rs < 32) {
				cpu.cpsrC = gprs[rd] & (1 << (rs - 1));
				gprs[rd] >>= rs;
			} else {
				cpu.cpsrC = gprs[rd] >> 31;
				if (cpu.cpsrC) {
					gprs[rd] = 0xFFFFFFFF;
				} else {
					gprs[rd] = 0;
				}
			}
		}
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructB1 = function(immediate, condOp) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		if (condOp()) {
			gprs[cpu.PC] += immediate;
		}
	};
};

ARMCoreThumb.prototype.constructB2 = function(immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[cpu.PC] += immediate;
	};
};

ARMCoreThumb.prototype.constructBIC = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = gprs[rd] & ~gprs[rm];
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructBL1 = function(immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[cpu.LR] = gprs[cpu.PC] + immediate;
	}
};

ARMCoreThumb.prototype.constructBL2 = function(immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var pc = gprs[cpu.PC];
		gprs[cpu.PC] = gprs[cpu.LR] + (immediate << 1);
		gprs[cpu.LR] = pc - 1;
	}
};

ARMCoreThumb.prototype.constructBX = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		cpu.switchExecMode(gprs[rm] & 0x00000001);
		var misalign = 0;
		if (rm == 15) {
			misalign = gprs[rm] & 0x00000002;
		}
		gprs[cpu.PC] = gprs[rm] & 0xFFFFFFFE - misalign;
	};
};

ARMCoreThumb.prototype.constructCMN = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var aluOut = (gprs[rd] >>> 0) + (gprs[rm] >>> 0);
		cpu.cpsrN = aluOut >> 31;
		cpu.cpsrZ = !(aluOut & 0xFFFFFFFF);
		cpu.cpsrC = aluOut > 0xFFFFFFFF;
		cpu.cpsrV = (gprs[rd] >> 31) == (gprs[rm] >> 31) &&
					(gprs[rd] >> 31) != (aluOut >> 31) &&
					(gprs[rm] >> 31) != (aluOut >> 31);
	};
};

ARMCoreThumb.prototype.constructCMP1 = function(rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var aluOut = gprs[rn] - immediate;
		cpu.cpsrN = aluOut >> 31;
		cpu.cpsrZ = !(aluOut & 0xFFFFFFFF);
		cpu.cpsrC = (gprs[rn] >>> 0) >= immediate;
		cpu.cpsrV = (gprs[rn] >> 31) && ((gprs[rn] ^ aluOut) >> 31);
	};
}

ARMCoreThumb.prototype.constructCMP2 = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var d = gprs[rd];
		var m = gprs[rm];
		var aluOut = d - m;
		var an = aluOut >> 31;
		var dn = d >> 31;
		cpu.cpsrN = an;
		cpu.cpsrZ = !(aluOut & 0xFFFFFFFF);
		cpu.cpsrC = (d >>> 0) >= (m >>> 0);
		cpu.cpsrV = dn != (m >> 31) && dn != an;
	};
};

ARMCoreThumb.prototype.constructCMP3 = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var aluOut = gprs[rd] - gprs[rm];
		cpu.cpsrN = aluOut >> 31;
		cpu.cpsrZ = !(aluOut & 0xFFFFFFFF);
		cpu.cpsrC = (gprs[rd] >>> 0) >= (gprs[rm] >>> 0);
		cpu.cpsrV = ((gprs[rd] ^ gprs[rm]) >> 31) && ((gprs[rd] ^ aluOut) >> 31);
	};
};

ARMCoreThumb.prototype.constructEOR = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = gprs[rd] ^ gprs[rm];
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructLDMIA = function(rn, rs) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var address = gprs[rn];
		var total = 0;
		var m, i;
		for (m = 0x01, i = 0; i < 8; m <<= 1, ++i) {
			if (rs & m) {
				gprs[i] = cpu.mmu.load32(address);
				address += 4;
				++total;
			}
		}
		cpu.mmu.waitMulti32(address, total);
		if (!((1 << rn) & rs)) {
			gprs[rn] = address;
		}
	};
};

ARMCoreThumb.prototype.constructLDR1 = function(rd, rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var n = gprs[rn] + immediate;
		gprs[rd] = cpu.mmu.load32(n);
		cpu.mmu.wait32(n);
		++cpu.cycles;
	};
};

ARMCoreThumb.prototype.constructLDR2 = function(rd, rn, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = cpu.mmu.load32(gprs[rn] + gprs[rm]);
		cpu.mmu.wait32(gprs[rn] + gprs[rm]);
		++cpu.cycles;
	}
};

ARMCoreThumb.prototype.constructLDR3 = function(rd, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = cpu.mmu.load32((gprs[cpu.PC] & 0xFFFFFFFC) + immediate);
		cpu.mmu.wait32(gprs[cpu.PC]);
		++cpu.cycles;
	};
};

ARMCoreThumb.prototype.constructLDR4 = function(rd, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = cpu.mmu.load32(gprs[cpu.SP] + immediate);
		cpu.mmu.wait32(gprs[cpu.SP] + immediate);
		++cpu.cycles;
	};
};

ARMCoreThumb.prototype.constructLDRB1 = function(rd, rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		var n = gprs[rn] + immediate;
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = cpu.mmu.loadU8(n);
		cpu.mmu.wait(n);
		++cpu.cycles;
	};
};

ARMCoreThumb.prototype.constructLDRB2 = function(rd, rn, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = cpu.mmu.loadU8(gprs[rn] + gprs[rm]);
		cpu.mmu.wait(gprs[rn] + gprs[rm]);
		++cpu.cycles;
	};
};

ARMCoreThumb.prototype.constructLDRH1 = function(rd, rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		var n = gprs[rn] + immediate;
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = cpu.mmu.loadU16(n);
		cpu.mmu.wait(n);
		++cpu.cycles;
	};
};

ARMCoreThumb.prototype.constructLDRH2 = function(rd, rn, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = cpu.mmu.loadU16(gprs[rn] + gprs[rm]);
		cpu.mmu.wait(gprs[rn] + gprs[rm]);
		++cpu.cycles;
	};
};

ARMCoreThumb.prototype.constructLDRSB = function(rd, rn, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = cpu.mmu.load8(gprs[rn] + gprs[rm]);
		cpu.mmu.wait(gprs[rn] + gprs[rm]);
		++cpu.cycles;
	};
};

ARMCoreThumb.prototype.constructLDRSH = function(rd, rn, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = cpu.mmu.load16(gprs[rn] + gprs[rm]);
		cpu.mmu.wait(gprs[rn] + gprs[rm]);
		++cpu.cycles;
	};
};

ARMCoreThumb.prototype.constructLSL1 = function(rd, rm, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		if (immediate == 0) {
			gprs[rd] = gprs[rm];
		} else {
			cpu.cpsrC = gprs[rm] & (1 << (32 - immediate));
			gprs[rd] = gprs[rm] << immediate;
		}
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructLSL2 = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var rs = gprs[rm] & 0xFF;
		if (rs) {
			if (rs < 32) {
				cpu.cpsrC = gprs[rd] & (1 << (32 - rs));
				gprs[rd] <<= rs;
			} else {
				if (rs > 32) {
					cpu.cpsrC = 0;
				} else {
					cpu.cpsrC = gprs[rd] & 0x00000001;
				}
				gprs[rd] = 0;
			}
		}
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructLSR1 = function(rd, rm, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		if (immediate == 0) {
			cpu.cpsrC = gprs[rm] >> 31;
			gprs[rd] = 0;
		} else {
			cpu.cpsrC = gprs[rm] & (1 << (immediate - 1));
			gprs[rd] = gprs[rm] >>> immediate;
		}
		cpu.cpsrN = 0;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
}

ARMCoreThumb.prototype.constructLSR2 = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var rs = gprs[rm] & 0xFF;
		if (rs) {
			if (rs < 32) {
				cpu.cpsrC = gprs[rd] & (1 << (rs - 1));
				gprs[rd] >>>= rs;
			} else {
				if (rs > 32) {
					cpu.cpsrC = 0;
				} else {
					cpu.cpsrC = gprs[rd] >> 31;
				}
				gprs[rd] = 0;
			}
		}
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructMOV1 = function(rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rn] = immediate;
		cpu.cpsrN = immediate >> 31;
		cpu.cpsrZ = !(immediate & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructMOV2 = function(rd, rn, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var d = gprs[rn];
		cpu.cpsrN = d >> 31;
		cpu.cpsrZ = !(d & 0xFFFFFFFF);
		cpu.cpsrC = 0;
		cpu.cpsrV = 0;
		gprs[rd] = d;
	};
};

ARMCoreThumb.prototype.constructMOV3 = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = gprs[rm];
	};
};

ARMCoreThumb.prototype.constructMUL = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		cpu.mmu.waitMul(gprs[rm]);
		if ((gprs[rm] & 0xFFFF0000) && (gprs[rd] & 0xFFFF0000)) {
			// Our data type is a double--we'll lose bits if we do it all at once!
			var hi = ((gprs[rd] & 0xFFFF0000) * gprs[rm]) & 0xFFFFFFFF;
			var lo = ((gprs[rd] & 0x0000FFFF) * gprs[rm]) & 0xFFFFFFFF;
			gprs[rd] = (hi + lo) & 0xFFFFFFFF;
		} else {
			gprs[rd] *= gprs[rm];
		}
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructMVN = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = ~gprs[rm];
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructNEG = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var d = -gprs[rm];
		cpu.cpsrN = d >> 31;
		cpu.cpsrZ = !(d & 0xFFFFFFFF);
		cpu.cpsrC = 0 >= (d >>> 0);
		cpu.cpsrV = (gprs[rm] >> 31) && (d >> 31);
		gprs[rd] = d;
	};
};

ARMCoreThumb.prototype.constructORR = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		gprs[rd] = gprs[rd] | gprs[rm];
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructPOP = function(rs, r) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		++cpu.cycles;
		var address = gprs[cpu.SP];
		var total = 0;
		var m, i;
		for (m = 0x01, i = 0; i < 8; m <<= 1, ++i) {
			if (rs & m) {
				cpu.mmu.waitSeq32(address);
				gprs[i] = cpu.mmu.load32(address);
				address += 4;
				++total;
			}
		}
		if (r) {
			gprs[cpu.PC] = cpu.mmu.load32(address) & 0xFFFFFFFE;
			address += 4;
			++total;
		}
		cpu.mmu.waitMulti32(address, total);
		gprs[cpu.SP] = address;
	};
};

ARMCoreThumb.prototype.constructPUSH = function(rs, r) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		var address = gprs[cpu.SP] - 4;
		var total = 0;
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		if (r) {
			cpu.mmu.store32(address, gprs[cpu.LR]);
			address -= 4;
			++total;
		}
		var m, i;
		for (m = 0x80, i = 7; m; m >>= 1, --i) {
			if (rs & m) {
				cpu.mmu.store32(address, gprs[i]);
				address -= 4;
				++total;
				break;
			}
		}
		for (m >>= 1, --i; m; m >>= 1, --i) {
			if (rs & m) {
				cpu.mmu.store32(address, gprs[i]);
				address -= 4;
				++total;
			}
		}
		cpu.mmu.waitMulti32(address, total);
		gprs[cpu.SP] = address + 4;
	};
};

ARMCoreThumb.prototype.constructROR = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var rs = gprs[rm] & 0xFF;
		if (rs) {
			var r4 = rs & 0x1F;
			if (r4 > 0) {
				cpu.cpsrC = gprs[rd] & (1 << (r4 - 1));
				gprs[rd] = (gprs[rd] >>> r4) | (gprs[rd] << (32 - r4));
			} else {
				cpu.cpsrC = gprs[rd] >> 31;
			}
		}
		cpu.cpsrN = gprs[rd] >> 31;
		cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
	};
};

ARMCoreThumb.prototype.constructSBC = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var m = (gprs[rm] >>> 0) + !cpu.cpsrC;
		var d = (gprs[rd] >>> 0) - m;
		cpu.cpsrN = d >> 31;
		cpu.cpsrZ = !(d & 0xFFFFFFFF);
		cpu.cpsrC = (gprs[rd] >>> 0) >= (d >>> 0);
		cpu.cpsrV = ((gprs[rd] ^ m) >> 31) && ((gprs[rd] ^ d) >> 31);
		gprs[rd] = d;
	};
};

ARMCoreThumb.prototype.constructSTMIA = function(rn, rs) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.wait(gprs[cpu.PC]);
		var address = gprs[rn];
		var total = 0;
		var m, i;
		for (m = 0x01, i = 0; i < 8; m <<= 1, ++i) {
			if (rs & m) {
				cpu.mmu.store32(address, gprs[i]);
				address += 4;
				++total;
				break;
			}
		}
		for (m <<= 1, ++i; i < 8; m <<= 1, ++i) {
			if (rs & m) {
				cpu.mmu.store32(address, gprs[i]);
				address += 4;
				++total;
			}
		}
		cpu.mmu.waitMulti32(address, total);
		gprs[rn] = address;
	};
};

ARMCoreThumb.prototype.constructSTR1 = function(rd, rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		var n = gprs[rn] + immediate;
		cpu.mmu.store32(n, gprs[rd]);
		cpu.mmu.wait(gprs[cpu.PC]);
		cpu.mmu.wait32(n);
	};
};

ARMCoreThumb.prototype.constructSTR2 = function(rd, rn, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.store32(gprs[rn] + gprs[rm], gprs[rd]);
		cpu.mmu.wait(gprs[cpu.PC]);
		cpu.mmu.wait32(gprs[rn] + gprs[rm]);
	};
};

ARMCoreThumb.prototype.constructSTR3 = function(rd, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.store32(gprs[cpu.SP] + immediate, gprs[rd]);
		cpu.mmu.wait(gprs[cpu.PC]);
		cpu.mmu.wait32(gprs[cpu.SP] + immediate);
	};
};

ARMCoreThumb.prototype.constructSTRB1 = function(rd, rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		var n = gprs[rn] + immediate;
		cpu.mmu.store8(n, gprs[rd]);
		cpu.mmu.wait(gprs[cpu.PC]);
		cpu.mmu.wait(n);
	};
};

ARMCoreThumb.prototype.constructSTRB2 = function(rd, rn, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.store8(gprs[rn] + gprs[rm], gprs[rd]);
		cpu.mmu.wait(gprs[cpu.PC]);
		cpu.mmu.wait(gprs[rn] + gprs[rm]);
	}
};

ARMCoreThumb.prototype.constructSTRH1 = function(rd, rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		var n = gprs[rn] + immediate;
		cpu.mmu.store16(n, gprs[rd]);
		cpu.mmu.wait(gprs[cpu.PC]);
		cpu.mmu.wait(n);
	};
};

ARMCoreThumb.prototype.constructSTRH2 = function(rd, rn, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.store16(gprs[rn] + gprs[rm], gprs[rd]);
		cpu.mmu.wait(gprs[cpu.PC]);
		cpu.mmu.wait(gprs[rn] + gprs[rm]);
	}
};

ARMCoreThumb.prototype.constructSUB1 = function(rd, rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var d = gprs[rn] - immediate;
		cpu.cpsrN = d >> 31;
		cpu.cpsrZ = !(d & 0xFFFFFFFF);
		cpu.cpsrC = (gprs[rn] >>> 0) >= immediate;
		cpu.cpsrV = (gprs[rn] >> 31) && ((gprs[rn] ^ d) >> 31);
		gprs[rd] = d;
	};
}

ARMCoreThumb.prototype.constructSUB2 = function(rn, immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var d = gprs[rn] - immediate;
		cpu.cpsrN = d >> 31;
		cpu.cpsrZ = !(d & 0xFFFFFFFF);
		cpu.cpsrC = (gprs[rn] >>> 0) >= immediate;
		cpu.cpsrV = (gprs[rn] >> 31) && ((gprs[rn] ^ d) >> 31);
		gprs[rn] = d;
	};
};

ARMCoreThumb.prototype.constructSUB3 = function(rd, rn, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var d = gprs[rn] - gprs[rm];
		cpu.cpsrN = d >> 31;
		cpu.cpsrZ = !(d & 0xFFFFFFFF);
		cpu.cpsrC = (gprs[rn] >>> 0) >= (gprs[rm] >>> 0);
		cpu.cpsrV = (gprs[rn] >> 31) != (gprs[rm] >> 31) &&
					(gprs[rn] >> 31) != (d >> 31);
		gprs[rd] = d;
	};
};

ARMCoreThumb.prototype.constructSWI = function(immediate) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.irq.swi(immediate);
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
	}
};

ARMCoreThumb.prototype.constructTST = function(rd, rm) {
	var cpu = this.cpu;
	var gprs = cpu.gprs;
	return function() {
		cpu.mmu.waitPrefetch(gprs[cpu.PC]);
		var aluOut = gprs[rd] & gprs[rm];
		cpu.cpsrN = aluOut >> 31;
		cpu.cpsrZ = !(aluOut & 0xFFFFFFFF);
	};
};
