module.exports = app => {
    const mongoose = app.datasource
    const schema = require('./../schemas/user')(app)
    return mongoose.model('User', schema, 'user');
}