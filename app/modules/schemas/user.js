module.exports = app => {
    let mongoose = app.datasource
    const schema = new mongoose.Schema({
        nome: String,
        user: String,
        pass: String,
        email: String,
        createdAt: Date,
        updateAt: {
            type: Date,
            default: Date.now
        },
        valid: Boolean
    });
    return schema
}