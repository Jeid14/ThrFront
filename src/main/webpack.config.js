const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const pages = [{
    template: './login/index.html',
    filename: 'index.html',
    chunks: ['main']
},
    {
        template: './game/game.html',
        filename: 'game.html',
        chunks: ['main']
    }
    // {
    //     template: './signup/signUp.html',
    //     filename: 'signUp.html',
    //     chunks: ['registration']
    // }
]

module.exports = {
    mode: 'development',
    entry: {
        main: './login/main.js',
        game: './game/main.js',
        // registration: './signup/script.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        ...pages.map((pageConfig) => new HTMLWebpackPlugin(pageConfig)),
        new CleanWebpackPlugin()
    ],
    devServer: {
        port: 4200,
    },
    module: {
        rules: [
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(jpg|svg|gif|png)/,
                use: ['file-loader'],
            }
        ]
    }
}