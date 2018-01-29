module.exports = app => {
    let mongoose = app.datasource
    const ReqProfProjSchema = require('./../schemas/ReqProfProj')(app);
    return mongoose.model('ReqProfProj', ReqProfProjSchema, 'req_prof_proj');
}