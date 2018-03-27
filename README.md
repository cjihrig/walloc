# walloc

[![Current Version](https://img.shields.io/npm/v/walloc.svg)](https://www.npmjs.org/package/walloc)
[![Build Status via Travis CI](https://travis-ci.org/cjihrig/walloc.svg?branch=master)](https://travis-ci.org/cjihrig/walloc)
![Dependencies](http://img.shields.io/david/cjihrig/walloc.svg)
[![belly-button-style](https://img.shields.io/badge/eslint-bellybutton-4B32C3.svg)](https://github.com/cjihrig/belly-button)

`malloc()` and `free()` bindings for WebAssembly in JavaScript.

## Basic Usage

Pass an absolute filename to the `walloc()` function. The result is the `exports` property of a [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance).

```
'use strict';
const Walloc = require('walloc');
const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
const walloc = new Walloc({
  memory,
  getTotalMemory () { return memory.buffer.byteLength; }
});

const ptr = walloc.malloc(2048);  // Allocate 2048 bytes.
// Do something with the allocated memory.
walloc.free(ptr); // Free the memory.
```

## API

`walloc` exports a single class with the following API.

### `Walloc(options)` constructor

  - Arguments
    - `options` (object) - A configuration object supporting the following schema.
      - `DYNAMICTOP_PTR` (number) - The value `sbrk()` returns. Optional. Defaults to `0`.
      - `STACKTOP` (number) - The top of the stack. Optional. Defaults to `0`.
      - `memory` (object) - An instance of `WebAssembly.Memory`.
      - `abort(err)` (function) - A function that is called when an error occurs. The error is passed as the `err` parameter. Optional. Defaults to a function that throws `err`.
      - `abortOnCannotGrowMemory()` (function) - A function that is called when memory allocation fails, and the WebAssembly memory cannot be grown. Optional. Defaults to a function that calls `abort()` with an error.
      - `enlargeMemory()` (function) - A function that attempts to grow the WebAssembly memory. Optional. Defaults to a function that calls `abortOnCannotGrowMemory()`.
      - `getTotalMemory()` (function) - A function that returns the total size of the memory. Optional. Defaults to a function that returns `0`.
      - `___setErrNo(errno)` (function) - A function that sets `errno` in C. Optional.

Constructs a new allocator instance. Must be called with `new`.

### `Walloc.prototype.malloc(size)`

  - Arguments
    - `size` (number) - The number of bytes to allocate.
  - Returns
    - `ptr` (number) - The base address of the allocated memory in the WebAssembly memory.

Attempts to allocate a block of memory with size `size`. On success, the base address is returned. Throws if memory cannot be allocated.

### `Walloc.prototype.free(ptr)`

  - Arguments
    - `ptr` (number) - The base address of the allocated memory block being freed.
  - Returns
    - Nothing

Releases the block of memory with base address `ptr`.
