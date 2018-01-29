module.exports = app => {
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver

    return {
        runningCreate: (object, res) => {
            const running = {
                request_taxi_driver_id: object.id,
                status: 0
            }
            RunningTaxiDriver.create(running)
                .then(request => res.status(200).json(request))
                .catch(err => res.status(400).json(err))
        }
    }
}
