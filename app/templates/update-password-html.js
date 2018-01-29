const hbs = require('handlebars')
const template = hbs.compile(` <h3> Vc alterou a senha para {{password}} </h3>`)

module.exports = template
