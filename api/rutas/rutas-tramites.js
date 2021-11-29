const express = require('express');
const app = express()
const mysqlConection = require('../conexion/conexionBD');
const jwt = require('jsonwebtoken');
const { json } = require('express');

app.post('/tramite', (req, res) => {
    let aux = req.body.requistos_tramite;
    const body = { //transformar vector a string para inserta a la BD
        nombre_TipoTramite: req.body.nombre_TipoTramite,
        requistos_tramite: aux.toString()
    }
    let consulta = 'INSERT INTO tipo_tramites set ?';
    mysqlConection.query(consulta, body, (err, tipoTramiteDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            tipoTramite: tipoTramiteDB,
            message: "El tipo de tramite fue creado exitosamente!"
        })
    })
})

app.get('/tramite', (req, res) => {
    let consulta = 'SELECT * from tipo_tramites';
    mysqlConection.query(consulta, (err, tipoTramiteDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (tipoTramiteDB <= 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No hay tipos de tramites registrados'
                }
            })
        }
        res.json({
            ok: true,
            tipoTramite: tipoTramiteDB,
            message: "Se obtuvieron a los tipos de tramites registrados"
        })
    })
})

app.put('/tramite/:id', (req, res) => {
    const id = req.params.id
    let aux = req.body.requistos_tramite;
    const body = {
        nombre_TipoTramite: req.body.nombre_TipoTramite,
        requistos_tramite: aux.toString()
    }
    let consulta = 'Update tipo_tramites set ? where id_tipoTramte=?';
    mysqlConection.query(consulta, [body, id], (err, tipoTramiteDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            tipoTramite: tipoTramiteDB,
            message: "El tipo de tramite fue actualizado exitosamente!"
        })
    })

})

app.delete('/tramite/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    let consulta = "delete from tipo_tramites where id_tipoTramte=?";
    mysqlConection.query(consulta, id, (err, tipoTramiteDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: "El tipo de tramite fue eliminado exitosamente!"
        })
    })

})

module.exports = app