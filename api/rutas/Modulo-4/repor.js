const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const { verificarToken } = require('../../middleware/autorizacion')

//CONFIGURACION MOTOR DE WORKFLOW
app.get('/reporte', verificarToken, (req, res) => {
    let consulta = 'Select * from tramite';
    mysqlConection.query(consulta, (err, workflowDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Reporte: workflowDb
        })

    })
})
app.post('/reporte-flujo', verificarToken, (req, res) => {
    let alterno = req.body.alterno
    let consulta = 'Select id_tramite from tramite where alterno=?';
    mysqlConection.query(consulta, alterno, (err, workflowDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Reporte: workflowDb
        })

    })
})

module.exports = app