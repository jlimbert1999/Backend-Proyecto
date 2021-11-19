const express = require('express')
const app = express()

app.use(require('./rutas-usuario'));
module.exports = app