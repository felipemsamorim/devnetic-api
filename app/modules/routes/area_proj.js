module.exports = app => {
    const url = `${app.config.url}/areaproj`
    const Controller = require('../controllers/area_proj')(app)

    app.route(url)
        .get(Controller.find)
        .post(Controller.create)

    app.route(`${url}/:id`)
        .get(Controller.get)
        .put(Controller.update)


}
