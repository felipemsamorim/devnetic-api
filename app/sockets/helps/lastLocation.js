module.exports = app => {
    const LastLocation = app.datasource.models.LastLocation
    const Driver = app.datasource.models.Driver

    function validateDriver (reject) {
        return reject({
            title: 'Motorista',
            message: 'Motorista não existe!'
        })
    }

    function driverId (reject) {
        return reject({
            title: 'Motorista Id',
            message: 'Motorista Id é requerido!'
        })
    }

    const returnUpdate = (object) =>
        object[0] ? {
            title: 'Alterado com sucesso!',
            message: 'Conseguimos alterar o seu registro com sucesso!'
        } : {
            title: 'Error em alterar!',
            message: 'Não foi possivel efetuar atualização, tente novamente!'
        }
    return {
        validateDriver: (object) => {
            return new Promise((resolve, reject) => {
                Driver.findById(object.driver_id)
                    .then(user => user ? resolve(user) : validateDriver(reject))
                    .catch(reject)
            })
        },
        validateObject: (object) => {
            return new Promise((resolve, reject) => {
                isNaN(object.driver_id) ? resolve(object) : driverId(reject)
            })
        },
        updateLocation: (object) => {
            const query = {
                where: {
                    driver_id: object.driver_id
                }
            }
            const location = {
                type: 'Point',
                coordinates: [object.lat, object.lng]
            }
            const mod = {
                location: location
            }
            return new Promise((resolve, reject) => {
                LastLocation.update(mod, query)
                    .then(object => resolve(returnUpdate(object)))
                    .catch(reject)
            })
        }
    }
}
