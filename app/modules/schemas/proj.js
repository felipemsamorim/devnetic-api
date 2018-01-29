module.exports = app => {
    let mongoose = app.datasource
    const ReqProfProjSchema = require('./../schemas/ReqProfProj')(app);
    var ProjSchema = new mongoose.Schema({
        id_proj: Number,
        titulo: String,
        requisicoes:[ReqProfProjSchema],
        createdAt: Date,
        updateAt: {
            type: Date,
            default: Date.now
        }

    });
    return ProjSchema;
}