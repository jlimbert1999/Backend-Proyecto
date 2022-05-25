const express = require('express');
const cors = require('cors');
const rutas = require('./api/rutas/rutas')

const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// CONEXION CON EL FRONTEND
app.use(express.static(path.join(__dirname, 'dist/frontend')));

//RUTAS
app.use(rutas)

//REDIRECCIONAR AL INDEX DEL FRONTEND
app.all('/*', (req, res) => { res.sendFile(path.join(__dirname + '/frontend/index.html')) })


module.exports = app;