module.exports = app => io => {
    io.on('connection', (socket) => {
        require('./location/lastLocation')(app)(socket)
    })
}
