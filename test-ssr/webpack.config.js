const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const nodeExternals = require('webpack-node-externals');

function getConfig(isServer) {
	return {
		entry: isServer
			? { server: './src/server.js' }
			: { main: './src/index.js' },
		output: {
			// 클라이언트는 브라우저의 캐싱효과 때문에 chunkhash 사용!
			filename: isServer ? '[name].bundle.js' : '[name].[chunkhash].js',
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/dist/',
		},
		target: isServer ? 'node' : 'web',
		// 서버 코드를 번들링할 때는 node_modules 폴더 밑에 있는 모듈을 번들 파일에 포함시키지 않도록 하기 위함
		externals: isServer ? [nodeExternals()] : [],
		// 이 설정을 하지 않으면 코드에서 __dirname을 사용할 경우 절대 경로인 슬래시(/)가 입력 됨
		// false를 입력할 경우 일반적인 노드의 __dirname으로 동작
		// server.js 파일에서 index.html 파일을 읽을 때 __dirname 사용하기 때문에 이 설정이 필요
		node: {
			__dirname: false,
		},
		// 서버 코드는 압축할 필요가 없다
		optimization: isServer
			? {
					splitChunks: false,
					minimize: false,
			  }
			: undefined,
		module: {
			rules: [
				{
					test: /\.js$/,
					use: {
						loader: 'babel-loader',
						options: {
							configFile: path.resolve(
								__dirname,
								isServer ? '.babelrc.server.js' : '.babelrc.client.js'
							),
						},
					},
				},
				{
					test: /\.(png|jpg|gif)$/,
					use: {
						loader: 'file-loader',
						options: {
							// file-loader 실행 시 한쪽에서만 파일을 복사해도 충분
							emitFile: isServer ? false : true,
						},
					},
				},
			],
		},
		// 두 플러그인 모두 클라이언트 코드 번들링 시 ㅎ실행
		plugins: isServer
			? []
			: [
					new HtmlWebpackPlugin({
						template: './template/index.html',
					}),
			  ],
		mode: 'production',
	};
}

// 웹팩 설정 파일에서 배열을 내보내면 배열의 각 아이템 개수만큼 웹팩이 실행됨! (클라이언트 1번, 서버 1번)
module.exports = [getConfig(false), getConfig(true)];
