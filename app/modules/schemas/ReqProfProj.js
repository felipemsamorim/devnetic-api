module.exports = app => {
    let mongoose = app.datasource
    var ReqProfProjSchema = new mongoose.Schema({
        categoria: String,
        especificacoes: [String],
        id_proj: Number,
        createdAt: Date,
        updateAt: {
            type: Date,
            default: Date.now
        }

    });
    return ReqProfProjSchema;
}