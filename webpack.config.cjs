const path = require('path');
const webpack = require('webpack');

const babelLoader = {
  rules: [
    {
      exclude: /node_modules/,
      test: /\.(ts|tsx|js|jsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript'
          ],
          plugins: [
            '@babel/plugin-syntax-typescript'
          ]
        }
      }
    }
  ]
};

module.exports = {
  entry: './src/server/server.tsx',
  mode: 'development',
  module: babelLoader,
  output: {
    filename: 'server.cjs',
    path: path.join(__dirname, '/dist')
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@public': path.resolve(__dirname, 'src/public'),
      '@views': path.resolve(__dirname, 'src/views')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  target: 'node',
  stats: {
    errorDetails: true // to show detailed errors in the console
  },
  // Suppress critical dependency warnings
  plugins: [
    new webpack.ContextReplacementPlugin(
      /express[\/\\]lib/,
      path.resolve(__dirname, 'src'),
      {}
    ),
    new webpack.EnvironmentPlugin({
      PORT: 3001
    })
  ]
};
