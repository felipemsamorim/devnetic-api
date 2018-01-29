module.exports = app => {
    return {
        token: (object) => {
            const jwt = require('jsonwebtoken')
            const key = require('../config/key')
            const token = jwt.sign(object, key.token, { algorithm: 'HS256' })

            return token
        },
        active: () => {
            function digit4 () {
                return Math.floor((1 + Math.random()) * 0x10000)
            }
            return digit4() + digit4()
        }
    }
}
