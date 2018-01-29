const request = require('request')

const Url = require('../config/key').cnpj

const comparing = (Response, Object) => (Response.nome.toUpperCase().trim() === Object.socialName.trim())

const errorTratment = (res) => res.status(400).json([{ title: 'CNPJ ou Razão Social', message: 'CNPJ ou Razão Social não Corresponde' }])

const errorApi = (res, body) => res.status(400).json({})

const searchCnpj = (object, res) => {
    var options = {
        method: 'GET',
        url: `${Url}/${object.cnpj}`,
        headers: {
            'cache-control': 'no-cache'
        }
    }

    request(options, (error, response, body) => {
        if (response.statusCode === 200) {
            try {
                const objectResponse = JSON.parse(body)
                if (comparing(objectResponse, object)) {
                    res.status(200).json(objectResponse)
                } else {
                    errorTratment(res, body)
                }
            } catch(err) {
                errorApi(res, body)
            }
        } else {
            errorApi(res, body)
        }
    })
}

module.exports = {
    searchCnpj: searchCnpj
}
