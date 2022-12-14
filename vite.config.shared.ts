/// <reference types="vite" />
import type { UserConfig } from "vite";


export interface VueBridgeBuildOptions {
  name: string;
  outDir?: string;
}

const defaults: Partial<VueBridgeBuildOptions> = {
  outDir: "dist",
};

const fileExtensionMap = {
  es: 'mjs',
  cjs: 'cjs',
  iife: 'js',
  umd: 'js'
};

export const buildConfig = (_options: VueBridgeBuildOptions): UserConfig['build'] => {
  const options = Object.assign({}, defaults, _options);

  return {
    outDir: options.outDir,

    lib: {
      entry: 'src/main.ts',
      formats: ['es', 'cjs', 'umd'],
      name: options.name, // global variable name for IIFE build
      fileName: (format) =>
        `index.${format}.${fileExtensionMap[format]}`,
    },

    rollupOptions: {
      output: {
        exports: 'named', // this means your main.ts file should only have named exports, and no default export!
        // Add global names for externalized dependencies here.
        // IIFE needs to now how to access external deps like: `window.Vue`
        globals: {
          vue: 'Vue',
          '@vue-bridge/runtime': 'VueBridge',
        },
      },
      external: ['vue', '@vue-bridge/runtime'],
    },
  };
};