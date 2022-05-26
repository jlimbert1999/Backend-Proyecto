const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');

//obtener la informacion de un tramite con su codigo para el solicitante
app.post('/consulta-tramite', (req, res) => {
    let { pin, dni } = req.body
    let consulta = 'Select t1.id_tramite, t1.estado, t3.nombres, t3.paterno, t3.materno, t3.expedido, t3.dni from tramite as t1 join solicitud as t2 on t2.id_tramite=t1.id_tramite join solicitante as t3 on t3.id_solicitante=t2.id_solicitante where t1.pin=? and t3.dni=?';
    mysqlConection.query(consulta, [pin, dni], (err, tramiteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Tramite: tramiteDb
        })

    })
})
module.exports = app