const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack') 
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({template: `${__dirname}/index.html`, filename: 'index.html', inject: 'body'});
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

var config = {
    entry:{
            vendor:['react','react-dom','react-router-dom'],
            index:'./js/client.js'
            },
    output:{
        path:`${__dirname}/dist`,
        filename:'[name].js'
    },
    devServer:{
        historyApiFallback: true,
        contentBase: './',
        inline:true,
        port:8080
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-2'],
                    plugins:['babel-plugin-transform-decorators-legacy']
                }
            }
        ]
    },
    plugins: [       
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static'
        // }),
        new webpack.optimize.ModuleConcatenationPlugin (),
        new webpack.DefinePlugin({ // <-- 减少 React 大小的关键
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            }
          }),
        //   new webpack.optimize.UglifyJsPlugin(), //最小化一切
          new webpack.optimize.AggressiveMergingPlugin(),//合并块
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
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:"jquery",
            "window.jQuery":"jquery"
            }),            
        new webpack
            .optimize
            .CommonsChunkPlugin({names: ['vendor', 'manifest'],filename:'[name].js', minChunks: Infinity}),
            // .CommonsChunkPlugin({names:'manifest', minChunks: Infinity}),
        ],
      

}

module.exports = config;