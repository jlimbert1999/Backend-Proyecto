const express = require('express');
const app = express();
const cors = require('cors');
const rutas = require('./api/rutas/rutas')

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors());

//RUTAS
app.use(rutas)


module.exports = app;