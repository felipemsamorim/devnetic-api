const validateNumber = object => typeof object === 'number'

const toConvertFloat = object => parseFloat(object)

const validateAmountAuthorizate = (amount, authorizedAmount) => (amount === authorizedAmount)

const withdrawRate = (amount, rate) => amount -= rate

const isDay = new Array("domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado")

const whatADay = (Date, isDay) => isDay[Date.getDay()]

const whatHour = (Date) => parseInt(Date.getHours())


module.exports = app => {
    const moment = require('moment')
    const Holidays = app.datasource.models.Holidays
    return {
        ticketBalance: (object) => {
            object.amount = toConvertFloat(object.amount)
            object.authorizedAmount = toConvertFloat(object.authorizedAmount)
            object.TypeTransaction.rate = toConvertFloat(object.TypeTransaction.rate)

            const retorno = validateAmountAuthorizate(object.amount, object.authorizedAmount)

            return new Promise((resolve, reject) => {
                if (validateNumber(object.amount) && validateNumber(object.authorizedAmount)) {
                    if (validateAmountAuthorizate(object.amount, object.authorizedAmount)) {
                        object.amount = withdrawRate(object.amount, object.TypeTransaction.rate)
                        resolve(object)
                    } else {
                        throw new Error('Not equals payment')
                    }
                } else {
                    throw new TypeError('Not number')
                }
            })
        },
        cardBalance: (object) => {
            object.amount = toConvertFloat(object.amount)
            object.authorizedAmount = toConvertFloat(object.authorizedAmount)

            return new Promise((resolve, reject) => {
                try {
                    if (validateNumber(object.amount) && validateNumber(object.authorizedAmount)) {
                        if (validateAmountAuthorizate(object.amount, object.authorizedAmount)) {
                            object.amount = parseFloat(object.transaction.dataValues.amountNotTax)
                            resolve(object)
                        } else {
                            throw new Error('Not equals payment')
                        }
                    } else {
                        throw new TypeError('Not number')
                    }
                } catch (err) {
                    reject({title: 'Error', message: 'Error tratment paid card'})
                }

            })
        },

        bandeirada: (object) => {
            const day = whatADay(new Date(), isDay)
            const hour = whatHour(new Date())
            const date = moment.utc(new Date()).format('YYYY-MM-DD')
            const query = {
                where: {
                    $and: [{
                        date: date
                    }, {
                        city_id: object.city_id
                    }],
                    $or: [{
                        date: date
                    }, {
                        country_id: object.country_id
                    }]
                }
            }
            return new Promise((resolve, reject) => {
                Holidays.findOne(query)
                    .then(holidays => {
                        if (holidays || day === 'Sabádo' || day === 'domingo' || hour >= 22 || hour <= 05) {
                            object.bandeirada2 = true
                            object.bandeirada1 = false
                            resolve(object)
                        } else {
                            object.bandeirada2 = false
                            object.bandeirada1 = true
                            resolve(object)
                        }
                    })
                    .catch(reject)
            })
        }
    }
}