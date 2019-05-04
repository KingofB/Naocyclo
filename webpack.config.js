const CleanWebpackPlugin = require('clean-webpack-plugin');
const VERSION = process.env.npm_package_version;

module.exports = {
	plugins: [new CleanWebpackPlugin()],
	entry: './js/App.js',
	output: {
		filename: 'app.bundle.v' + VERSION + '.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude:/(node_modules|jquery)/,
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
	devtool: 'eval-source-map'
};
