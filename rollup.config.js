import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import {uglify} from 'rollup-plugin-uglify';
import uglifyES from 'rollup-plugin-uglify-es';
import pkg from './package.json';

function getMinifiedFileName(fileName) {
  return `${fileName.substring(0, fileName.lastIndexOf('.'))}.min.${fileName.substring(fileName.lastIndexOf('.') + 1)}`;
}

export default [{
  input: `src/index.ts`,
  output: [
    {file: pkg.main, name: 'responsiveBox', format: 'umd', sourcemap: true},
    {file: pkg.module, format: 'es', sourcemap: true}
  ],
  plugins: [
    json(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015'
        }
      }
    }),
    commonjs(),
    resolve(),
    sourceMaps()
  ]
}, {
  input: `src/index.ts`,
  output: [
    {file: getMinifiedFileName(pkg.main), name: 'garlic', format: 'umd'},
  ],
  plugins: [
    json(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015'
        }
      }
    }),
    commonjs(),
    resolve(),
    uglify()
  ]
}, {
  input: `src/index.ts`,
  output: [
    {file: getMinifiedFileName(pkg.module), format: 'es'},
  ],
  plugins: [
    json(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015'
        }
      }
    }),
    commonjs(),
    resolve(),
    uglifyES()
  ]
}];
