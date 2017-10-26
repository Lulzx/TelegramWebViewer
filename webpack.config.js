module.exports = {
    entry : './js/chat.js',
    output: {
        path: __dirname + '/public/js',
        filename: 'script.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
                query: {
                    cacheDirectory: true,
                    presets: ['env', 'react']
                }
            }
        ]
    }
}