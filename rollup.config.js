import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const inputs = {
  'index': 'src/index.ts',
  'server': 'src/server/index.ts',
  'client': 'src/client/index.ts',
  'hooks': 'src/client/hooks/index.ts',
  'utils/mask': 'src/utils/mask.ts'
};

export default {
  input: inputs,
  output: [
    {
      dir: 'dist',
      entryFileNames: '[name].esm.js',
      chunkFileNames: 'chunks/[name]-[hash].esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      dir: 'dist',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/[name]-[hash].js',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ 
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
    }),
    terser(),
  ],
  external: ['react', 'react-dom', 'next'],
};