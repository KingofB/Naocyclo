const CleanWebpackPlugin = require('clean-webpack-plugin');
const VERSION = process.env.npm_package_version;
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './js/App.js',
    output: {
        filename: 'app.bundle.v' + VERSION + '.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|jquery)/,
                use: {
                    loader: 'eslint-loader'
                },
                enforce: 'pre'
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|jquery)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'eval-source-map',
    plugins: [new CleanWebpackPlugin(),
        new CopyPlugin([
            {from: 'img/**/*', to: '.'},
            {from: 'icomoon/**/*', to: '.'},
            {from: 'css/**/*', to: '.'},
            {from: 'jquery/**/*', to: '.'},
            {from: 'js/diaporama.json', to: 'js'},
            {from: 'index.html', to: 'index.html'}
        ]),
    ],
};
