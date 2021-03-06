const path = require('path');

module.exports = {
    context: __dirname,
    entry: './frontend/new_chess.jsx',
    output: {
        path: path.resolve(__dirname, 'app', 'assets', 'javascripts'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: [
                    {
                    loader: 'babel-loader',
                    query: {
                        presets: ['@babel/env', '@babel/react']
                    }
                }
                ]
            }
            // {
            //     test: /\.(jpe?g|png|gif|svg)$/i,
            //     exclude: /(node_modules)/,
            //     use: [
            //         {
            //             loader: "url-loader",
            //             options: {
            //                 limit: 500
            //             }
            //         }
            //     ]
            // }
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".js", ".jsx", "*"]
    }
};