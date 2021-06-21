module.exports = {
    devServer: {
        proxy: {
            '/user': {
                target: 'http://localhost:2020',
                changeOrigin: true
            },
            '/admin': {
                target: 'http://localhost:2020',
                changeOrigin: true
            },
        }
    }
}
