module.exports = app => {
    let mongoose = app.datasource
    const ProjSchema = require('./../schemas/proj')(app);
    return mongoose.model('Proj', ProjSchema, 'proj');
}