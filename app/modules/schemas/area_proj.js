module.exports = app => {
    let mongoose = app.datasource
    const schema = new mongoose.Schema({
        nome: String
    });
    return schema
}