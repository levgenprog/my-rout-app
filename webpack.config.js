import { join, resolve } from 'path';
import webpack from 'webpack';

const __dirname = import.meta.dirname;
const mode = process.env.NODE_ENV || 'development';

export default {
  mode,
  entry: './src/server/server.tsx',
  externalsPresets: { 
    node: true 
  },
  externals: [
    { 'express': 'commonjs express' }
  ],
  module: {
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
  },
  output: {
    filename: 'index.cjs',
    path: join(__dirname, '/dist/server'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.NX_PAGES_DIR': '"@pages"',
    })
  ],
  resolve: {
    alias: {
      '@assets': resolve(__dirname, 'src/assets'),
      '@config': resolve(__dirname, 'src/config'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@components': resolve(__dirname, 'src/components'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@public': resolve(__dirname, 'src/public'),
      '@views': resolve(__dirname, 'src/views')
    },
    conditionNames: ['import', 'node'],
    extensionAlias: {
      '.js': [
        '.ts',
        '.js',
        '.tsx',
        '.jsx'
      ]
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },  
  stats: {
    errorDetails: true // to show detailed errors in the console
  },
  target: 'node'
};