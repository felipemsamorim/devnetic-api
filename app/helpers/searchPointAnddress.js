module.exports = app => {
    const Help = require('../helpers/googleMaps')

    return {
        pointAddressTaxi: (object) => {
            const objectClient = {
                lat: object.clientLat,
                lng: object.clientLng
            }

            return new Promise((resolve, reject) => {
                Help.returnCityStateCountry(objectClient)
                    .then(googleClient => {
                        object.addressClient = googleClient.address
                        resolve(object)
                    })
                    .catch(reject)
            })
        },
        pointAddressLocation: (object) => {
            const objectClient = {
                lat: object.clientLat,
                lng: object.clientLng
            }
            return new Promise((resolve, reject) => {
                Help.returnCityStateCountry(objectClient)
                    .then(googleClient => {
                        object.addressClient = googleClient.address
                        resolve(object)
                    })
                    .catch(reject)
            })
        }
    }
}
