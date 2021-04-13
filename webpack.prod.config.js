const path = require('path');

module.exports = {
    entry: "./src/game.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    mode: 'production',
    watch: false,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}