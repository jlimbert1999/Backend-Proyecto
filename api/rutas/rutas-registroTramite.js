const express = require('express');
const app = express()
const mysqlConection = require('../conexion/conexionBD');
const jwt = require('jsonwebtoken');
const { json } = require('express');

app.post('/registrar-tramite', (req, res) => {
    let body = req.body
    let consulta = 'INSERT INTO tramites set ?';
    mysqlConection.query(consulta, body, (err, TramiteDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            Tramite: TramiteDB,
            message: "El de tramite fue registrado exitosamente!"
        })
    })
})

app.get('/registrar-tramite', (req, res) => {
    let consulta = 'SELECT * from tramites';
    mysqlConection.query(consulta, (err, TramiteDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (TramiteDB <= 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No hay tramites registrados'
                }
            })
        }
        res.json({
            ok: true,
            Tramite: TramiteDB,
            message: "Se obtuvieron a los tramites registrados"
        })
    })
})

module.exports = app