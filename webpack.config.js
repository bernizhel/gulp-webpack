const path = require('path');

const filename = ext => `[name].${ext}`;

module.exports = {
    context: path.resolve(__dirname, 'src'),
    output: {
        filename: filename('js'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    mode: process.env.NODE_ENV ?? 'development',
};