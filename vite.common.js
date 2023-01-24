import { resolve } from 'path';

import nesting from 'postcss-nesting';
import mixins from 'postcss-mixins';

export default function createConfig(basedir, moduleName) {
  const rollupOptions = moduleName === 'deskfy-custom-picmo' ? {} : {
    external: ['deskfy-custom-picmo'],
    output: {
      globals: {
        "deskfy-custom-picmo": 'deskfy-custom-picmo'
      }
    }
  };

  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify('production')
    },
    css: {
      postcss: {
        plugins: [
          mixins(),
          nesting(),
        ]
      }
    },
    build: {
      rollupOptions,
      lib: {
        entry: resolve(basedir, 'src/index.ts'),
        name: moduleName,
        formats: ['es', 'umd'],
        fileName: format => {
          if (format === 'es') {
            return 'index.js';
          }
  
          if (format === 'umd') {
            return `umd/index.js`;
          }
        }
      }
    }
  };
}