module.exports = app => {
    const url = `${app.config.url}/user`
    const Controller = require('../controllers/user')(app)

    app.route(url)
        .get(Controller.find)
        .post(Controller.create)

    app.route(`${url}/login`)
        .post(Controller.login)
    
        app.route(`${url}/:id`)
        .get(Controller.findOne)


}
