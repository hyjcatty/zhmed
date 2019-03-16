/**
 * Created by hyj on 2016/9/27.
 */
var webpack = require('webpack');
module.exports = {
    entry: [

        "./src/main/app.js"
    ],
    output: {
        path: __dirname+"/build",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015','react']
                }
            },{
                test:/\.css$/,
                loader:"style!css"
            },{
                test:/\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader:'url-loader?limit=50000&name=[path][name].[ext]'
            },{
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015','react']
                }
            }
        ]
    },
    resolve: {
        extensions: ['','.coffee','.js',',json']
    },
    plugins:[
        new webpack.NoErrorsPlugin()
    ],
    //devtool: "cheap-module-eval-source-map"
    devtool:false
}