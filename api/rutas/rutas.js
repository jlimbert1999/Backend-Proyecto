const express = require('express')
const app = express()

//importacion de rutas
app.use(require('./rutas-usuario')); //rutas usuario
app.use(require('./rutas-tramites')); //rutas usuario
app.use(require('./rutas-registroTramite')); //rutas usuario
module.exports = app