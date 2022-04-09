const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const jwt = require('jsonwebtoken');

app.get('/permisos/:id', (req, res) => {
    let id_cuenta = req.params.id
    let consulta = 'SELECT * from permisos where id_cuenta=?';
    mysqlConection.query(consulta, id_cuenta, (err, permisosDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (permisosDB <= 0) {
            return res.json({
                ok: true,
                Permisos: []
            })
        }
        res.json({
            ok: true,
            Permisos: permisosDB
        })
    })
})

app.post('/permiso', (req, res) => {
    const body = req.body
    let consulta = 'INSERT INTO permisos set ?';
    mysqlConection.query(consulta, body, (err, permisosDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Permisos: permisosDB,
            message: "Se registraron los permisos correctamente!"
        })

    })
})

module.exports = app