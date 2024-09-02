const fs = require('fs');

const esbuild = require('esbuild');

const injectHtml = () => ({
  name: 'inject-html',
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length === 0) {
        const html = fs.readFileSync('./src/index.html', 'utf8');
        const withScript = html.replace(
          '</body>',
          `<script src="/static/client.js"></script></body>`
        );

        fs.writeFileSync('./dist/index.html', withScript);
      }
    });
  }
});

const jsxConfig = {
  jsx: 'automatic',
  loader: { '.js': 'jsx', '.jsx': 'jsx' },
  resolveExtensions: ['.js', '.jsx']
};

esbuild.build({
  bundle: true,
  define: {
    'process.env.PORT': '3000'
  },
  entryPoints: ['./src/server/server.jsx'],
  external: ['react', 'react-dom', 'express'],
  outfile: './dist/server.cjs',
  platform: 'node',
  target: 'node14',
  ...jsxConfig
}).catch(() => process.exit(1));

esbuild.build({
  bundle: true,
  entryPoints: ['./src/index.tsx'],
  outfile: './dist/client.js',
  platform: 'browser',
  plugins: [injectHtml()],
  publicPath: '/static',
  target: 'es2015',
  ...jsxConfig
}).catch(() => process.exit(1));
