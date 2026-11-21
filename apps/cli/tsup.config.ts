import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/bin.ts'],
  clean: true,
  dts: true,
  format: ['esm'],
  sourcemap: true,
  target: 'node20',
  shims: false,
  esbuildOptions(options) {
    options.banner = { 'js': '#!/usr/bin/env node' };
  },
});
