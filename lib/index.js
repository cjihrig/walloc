'use strict';
const Path = require('path');
const Wequire = require('wequire');
const wasmPath = Path.join(__dirname, 'walloc.wasm');
const wasm = Symbol('wasm');


function abort (err) {
  throw err;
}


function abortOnCannotGrowMemory () {
  abort(new Error('cannot grow memory'));
}


const defaults = {
  DYNAMICTOP_PTR: 0,
  STACKTOP: 0,
  memory: null,
  abort,
  abortOnCannotGrowMemory,
  enlargeMemory () { abortOnCannotGrowMemory(); },
  getTotalMemory () { return 0; },
  ___setErrNo (errno) {}
};


class Walloc {
  constructor (options) {
    const env = Object.assign({}, defaults, options);

    this[wasm] = Wequire(wasmPath, { env });
  }

  malloc (size) {
    return this[wasm]._Malloc(size);
  }

  free (ptr) {
    this[wasm]._Free(ptr);
  }
}

module.exports = Walloc;
