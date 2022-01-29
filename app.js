const express = require('express');
const cors = require('cors');
const rutas = require('./api/rutas/rutas')

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

//RUTAS
app.use(rutas)


module.exports = app;