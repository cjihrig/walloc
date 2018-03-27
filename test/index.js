'use strict';
/* global WebAssembly */
const Code = require('code');
const Lab = require('lab');
const Walloc = require('../lib');

// Test shortcuts
const lab = exports.lab = Lab.script();
const { describe, it } = lab;
const { expect } = Code;


describe('Walloc', () => {
  it('creates a new instance', () => {
    const walloc = new Walloc({
      memory: new WebAssembly.Memory({ initial: 256, maximum: 256 })
    });

    expect(walloc).to.be.an.instanceOf(Walloc);
  });

  it('allocates and frees memory dynamically', () => {
    const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
    const walloc = new Walloc({
      memory,
      getTotalMemory () { return memory.buffer.byteLength; }
    });
    let addr1 = 0;
    let addr2 = 0;

    expect(memory.buffer.byteLength).to.equal(16777216);
    addr1 = walloc.malloc(2048);
    expect(addr1).to.be.greaterThan(0);
    addr2 = walloc.malloc(1024);
    expect(addr2).to.be.greaterThan(addr1 + 2048);
    walloc.free(addr1);
    walloc.free(addr2);
  });

  it('throws when memory cannot be enlarged', () => {
    const walloc = new Walloc({
      memory: new WebAssembly.Memory({ initial: 256, maximum: 256 })
    });

    expect(() => {
      walloc.malloc(1);
    }).to.throw(Error, 'cannot grow memory');
  });
});
