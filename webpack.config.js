const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack')
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({ template: `${__dirname}/index.html`, filename: 'index.html', inject: 'body' });
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

var config = {
    entry: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        index: './js/client.js'
    },
    output: {
        path: `${__dirname}/dist`,
        filename: '[name].[chunkhash:8].js',
    },
    resolve: {
        extensions: ['.css', '.scss', '.js', '.json']

    },
    devServer: {
        historyApiFallback: true,
        contentBase: './',
        inline: true,
        port: 8080
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-2'],
                    plugins: ['babel-plugin-transform-decorators-legacy']
                }
            },
            {
                test: /\.s[ac]ss$/,
                include:  path.resolve(__dirname, '/app'),
                loaders: ['style-loader','css-loader','sass-loader'
                ]
            }, , {
                test: /\.html$/,
                loaders: ['raw-loader']
            }
        ],
        rules: [
            {
                test: /.*/,
                include: path.resolve(__dirname, '/js'),
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015', 'react', 'stage-2'],
                        plugins: ['babel-plugin-transform-decorators-legacy']
                    }

                },
            },

            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    query: {
                        presets: ['es2015', 'react', 'stage-2'],
                        plugins: ['babel-plugin-transform-decorators-legacy']
                    }
                },
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },

            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader",
                        options: {
                            outputStyle: "compressed"
                        }
                    },]
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader",
                        options: {
                            compress: true
                        }
                    }]
                })
            },
            {
                test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)$/i,
                use:
                {
                    loader: "url-loader",
                    query: {
                        // inline base64 DataURL for <=2KB images, direct URLs for the rest
                        limit: 2048,
                        name: "[name].[ext]"
                    }
                }
            }
        ]
    },
    plugins: [
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static'
        // }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({ // <-- 减少 React 大小的关键
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new ExtractTextPlugin('./css/index.[chunkhash:8].css'), //css scss less文件打包
        //   new webpack.optimize.UglifyJsPlugin(), 
        new webpack.optimize.AggressiveMergingPlugin(),
        HTMLWebpackPluginConfig,
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require('./vendor/Vendor_manifest.json'),
        //   }),        

        // new AddAssetHtmlPlugin({
        //     filepath: require.resolve(`${__dirname}/vendor/Vendor.dll.js`),
        //     hash: true,
        //     includeSourcemap: false
        // }),
        new AddAssetHtmlPlugin({
            filepath: require.resolve(`${__dirname}/js/constants/constants.js`),
            hash: true,
            includeSourcemap: false
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack
            .optimize
            .CommonsChunkPlugin({ names: ['vendor', 'manifest'], filename: '[name].js', minChunks: Infinity }),
        // .CommonsChunkPlugin({names:'manifest', minChunks: Infinity}),
    ],


}

module.exports = config;