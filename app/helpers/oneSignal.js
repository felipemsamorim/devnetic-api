
const key = require('../config/key').oneSignal

const oneSignal = require('onesignal')([key.apiKey], [key.appId], true)

module.exports = ({
    createNotification: (message, data, tokenGcm) =>
        new Promise((resolve, reject) => {
            oneSignal.createNotification(message, data, tokenGcm)
                .then(resolve)
                .catch(reject)
        })
})
