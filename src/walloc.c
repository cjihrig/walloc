#include <emscripten.h>
#include <stdint.h>
#include <stdlib.h>


EMSCRIPTEN_KEEPALIVE
uint64_t Malloc(uint64_t size) {
  void* mem = malloc((size_t) size);
  return (uint64_t) mem;
}


EMSCRIPTEN_KEEPALIVE
void Free(uint64_t addr) {
  free((void*) addr);
}
