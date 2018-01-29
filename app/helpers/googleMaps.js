const maps = require('@google/maps')
const googleKey = require('../config/key').googleKey

let googleMapsClient = maps.createClient({
    key: googleKey
})

const calculateSurplus = object => (object.meters - object.franchiseMeters) / 1000

const calculateValueTotal = (object, surplus) => (parseFloat(object.baseValue) + surplus) + parseFloat(object.fixedValue)

const compared = (totalKm, franchiseMeters) => (totalKm - franchiseMeters) > 0

const requestReturn = object => object.requestReturn === true ? object.valueTotal * (parseFloat(object.requestReturnValue) + 1) : object.valueTotal
const estimateAwait = object => object.estimateAwait === true ? object.valueTotal + (object.time * parseFloat(object.estimateAwaitValue)) : object.valueTotal

const calulateTime = (time, valueTime) => tratmentSecondsToMinuts(time) + valueTime

const calculateKm = (km, valueKm) => ((km / 1000) + valueKm).toFixed(2)

const tratmentSecondsToMinuts = (time) => time / 60

const calculateBandeiraTotal = (valueTime, valueKm, bandeirada, fixedValue) => (valueTime + valueKm + bandeirada + fixedValue)

const whatBandeirada = (object) => object.bandeirada1 ? parseFloat(object.rates.baseValue1) + parseFloat(object.rates.minBandeirada1) : parseFloat(object.rates.baseValue2) + parseFloat(object.rates.minBandeirada2)

const getAddressLatLng = object => {
    const address = `${object.address},${object.number},${object.city},${object.state}`
    return new Promise((resolve, reject) =>
        googleMapsClient.geocode({
            'address': address
        }, (status, result) => status ? reject(status) : resolve(result))
    )
}

const getLocationAddressLatLng = (lat, lng) => {
    const latlng = `${parseFloat(lat)},${parseFloat(lng)} `
    return new Promise((resolve, reject) =>
        googleMapsClient.reverseGeocode({
            'latlng': latlng
        }, (status, result) => status ? reject(status) : resolve(result))
    )
}

const returnCityStateCountry = object => {
    return new Promise((resolve, reject) => {
        getLocationAddressLatLng(object.lat, object.lng)
            .then(googleSearch => {
                try {
                    object.address = {
                        number: '',
                        district: '',
                        city: '',
                        state: '',
                        addressComplet: '',
                        country: '',
                        zipCode: ''
                    }
                    googleSearch.json.results[0].address_components.map((search) => {
                        if (search.types[0] === 'street_number') object.address.number = search.short_name
                        if (search.types[1] === 'sublocality') object.address.district = search.short_name
                        if (search.types[0] === 'administrative_area_level_2') object.address.city = search.short_name
                        if (search.types[0] === 'administrative_area_level_1') object.address.state = search.short_name
                        if (search.types[0] === 'postal_code') object.address.zipCode = search.short_name
                        if (search.types[0] === 'country') object.address.country = search.short_name
                    })

                    object.address.addressComplet = googleSearch.json.results[0].formatted_address

                    resolve(object)
                } catch (err) {
                    reject(err)
                }
            })
            .catch(resolve)
    })
}

const calculateRateSurplus = object => {
    if (compared(object.meters, object.franchiseMeters)) {
        object.valueTotal = calculateValueTotal(object, calculateSurplus(object))
        object.valueTotal = requestReturn(object)
        object.valueTotal = estimateAwait(object)
        object.valueTotal = object.valueTotal.toFixed(2)
        return object
    } else {
        object.valueTotal = object.baseValue
        return object
    }
}

const validateNodeGoogle = (object) => {
    object.json.add = 0.0
    let test = null
    object.json.rows[0].elements.map((element, index) => {
        if (test === null) {
            test = element
        } else {
            if (test.distance.value === element.distance.value) {
                object.json.add += 1.0
                object.json.rows[0].elements.splice(index, 1)
            } else {
                test = element
            }
        }
    })
    return object
}

const calculatePointAddressMulti = object => {
    const query = {
        origins: object.init,
        destinations: object.finish,
        mode: 'driving'
    }

    return new Promise((resolve, reject) => {
        googleMapsClient.distanceMatrix(query, (err, result) => {
            if (err) reject(err)
            result = validateNodeGoogle(result)
            try {
                result.json.rows[0].elements.map((element, index) => {
                    object.calculate[index].duration = element.duration.text
                    object.calculate[index].durationTime = element.duration.value
                    object.calculate[index].kilometers = element.distance.text
                    object.calculate[index].meters = element.distance.value
                    object.calculate[index] = calculateRateSurplus(object.calculate[index])
                    object.calculate[index].originAddresses = result.json.origin_addresses[index]
                    object.calculate[index].destinationAddresses = result.json.destination_addresses[index]
                })
            } catch (error) {
                console.log(error)
            }
            console.log(object)
            resolve(object)
        })
    })
}
const calculatePointAddress = object => {
    const query = {
        origins: `${object.pointInit[0]}, ${object.pointInit[1]}`,
        destinations: `${object.pointFinish[0]}, ${object.pointFinish[1]}`,
        mode: 'driving'
    }
    return new Promise((resolve, reject) => {
        googleMapsClient.distanceMatrix(query, (err, result) => {
            if (err) reject(err)
            object.duration = result.json.rows[0].elements[0].duration.text
            object.durationTime = result.json.rows[0].elements[0].duration.value
            object.kilometers = result.json.rows[0].elements[0].distance.text
            object.meters = result.json.rows[0].elements[0].distance.value
            object = calculateRateSurplus(object)
            object.originAddresses = result.json.origin_addresses
            object.destinationAddresses = result.json.destination_addresses
            resolve(object)
        })
    })
}

const calculatePointAddressTaxiSum = (object) => {
    const timeTotal = parseFloat(calulateTime(object.durationTime, parseFloat(object.bandeirada1 ? object.rates.minBandeirada1 : object.rates.minBandeirada2)))
    const kmTotal = object.bandeirada1 ? parseFloat(calculateKm(object.meters, parseFloat(object.rates.valueKm1))) : parseFloat(calculateKm(object.meters, parseFloat(object.rates.valueKm2)))
    const bandeirada = parseFloat(whatBandeirada(object))
    object.valueTotal = (calculateBandeiraTotal(timeTotal, kmTotal, bandeirada, parseFloat(object.rates.fixedValue))).toFixed(2)
    delete object.rates
    return object
}

const calculatePointAddressTaxi = object => {
    const query = {
        origins: `${object.clientLat}, ${object.clientLng}`,
        destinations: `${object.destinationLat}, ${object.destinationLng}`
    }
    return new Promise((resolve, reject) => {
        googleMapsClient.distanceMatrix(query, (err, result) => {
            if (err) reject(err)
            object.duration = result.json.rows[0].elements[0].duration.text
            object.durationTime = result.json.rows[0].elements[0].duration.value
            object.kilometers = result.json.rows[0].elements[0].distance.text
            object.meters = result.json.rows[0].elements[0].distance.value
            object.originAddresses = result.json.origin_addresses
            object.destinationAddresses = result.json.destination_addresses
            object = calculatePointAddressTaxiSum(object)
            resolve(object)
        })
    })
}

module.exports = {
    getAddressLatLng: getAddressLatLng,
    returnCityStateCountry: returnCityStateCountry,
    calculatePointAddress: calculatePointAddress,
    calculatePointAddressMulti: calculatePointAddressMulti,
    calculatePointAddressTaxi: calculatePointAddressTaxi,
    getLocationAddressLatLng: getLocationAddressLatLng
}