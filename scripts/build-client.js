const esbuild = require('esbuild');
const path = require('path');

esbuild.buildSync({
  entryPoints: [path.join(__dirname, '..', 'src', 'blob-upload.js')],
  outfile: path.join(__dirname, '..', 'public', 'blob-upload.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
});
