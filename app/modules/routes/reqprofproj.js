module.exports = app => {
    const url = `${app.config.url}/reqprofproj`
    const Controller = require('../controllers/reqprofproj')(app)

    app.route(url)
        .get(Controller.find)
        .post(Controller.create)

    app.route(`${url}/:input`)
        .get(Controller.contains)

}
