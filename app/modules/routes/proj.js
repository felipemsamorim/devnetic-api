module.exports = app => {
    const url = `${app.config.url}/proj`
    const Controller = require('../controllers/proj')(app)

    app.route(url)
        .get(Controller.find)
        .post(Controller.create)

    app.route(`${url}/:id`)
        .get(Controller.get)
        .put(Controller.update)


}
