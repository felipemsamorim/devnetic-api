module.exports = app => socket => {
    const Help = require('../helps/lastLocation')(app)

    const errorDestination = (err) => {
        socket.emit('errors', err)
    }
    const returnObject = (object) => socket.emit('update', object)

    socket.on('lastLocationDriver', (object) => {
        Help.validateDriver(object)
            .then(validateUser => {
                Help.updateLocation(object)
                    .then(returnObject)
                    .catch(errorDestination)
            })
            .catch(errorDestination)
    })

    socket.on('testeLocation', (object) => {
        socket.emit('testeRetornoLocation', (object))
    })
}
