module.exports = app => {
    const mongoose = app.datasource
    const schema = require('./../schemas/area_proj')(app)
    return mongoose.model('AreaProj',schema,'area_proj')
}