const esbuild = require('esbuild');

const jsxConfig = {
  loader: { '.js': 'jsx', '.jsx': 'jsx' },
  jsx: 'automatic',
  resolveExtensions: ['.js', '.jsx']
};

esbuild.build({
  entryPoints: ['./src/server/server.jsx'],
  bundle: true,
  platform: 'node',
  target: 'node14',
  outfile: './dist/server.cjs',
  define: {
    'process.env.PORT': '3000'
  },
  external: ['react', 'react-dom', 'express'],
  ...jsxConfig
}).catch(() => process.exit(1));
