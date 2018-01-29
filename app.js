const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const path = require('path')
const socket = require('socket.io')
const morgan = require('morgan')
const compression = require('compression')
const validator = require('express-validator')
const validateFormat = require('./app/errors/validate')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(validator(validateFormat))
app.use(morgan('dev'))
app.use(compression())
app.use(cors())

const config = require('./app/config/urls')
const datasource = require('./app/databases/mongodb')
app.config = config
app.datasource = datasource(app)

app.jwt = require('./app/helpers/jwt')(app).validate

const port = process.env.PORT || 3200

const server = http.createServer(app)

require('./routes')(app)


app.use((req, res) => res.status(404).json({ error: 'Route not found' }))
server.listen(port)

module.exports = app
