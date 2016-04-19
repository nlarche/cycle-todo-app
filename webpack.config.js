module.exports = {
    context : __dirname,
    entry: {
        bundle: './src/index.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    devtool : 'source-map'   
}