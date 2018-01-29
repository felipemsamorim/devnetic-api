const mongoose = require('Mongoose')
mongoose.Promise = require('bluebird')


const url = 'mongodb://127.0.0.1:27017/atlante_dev'

const options = {
    useMongoClient: true
}


module.exports = (app) => {
    mongoose.connect(url, options)
    .then(() => {
        console.log('Mongodb Connected : )')
        mongoose.connection.on('error', (err) => {
            console.log(`mongoose connection: ${err}`)
        })
        mongoose.connection.on('reconnected', () => {
            console.log('Reconnected to MongoDB')
        })
    })
    .catch((err) => {
        console.log(`rejected promise ${err}`)
        mongoose.disconnect()
    })
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongodb: bye : )')
        process.exit(0)
    })
})
    
    return mongoose
}
