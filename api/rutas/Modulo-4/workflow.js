const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');

//CONFIGURACION MOTOR DE WORKFLOW
app.get('/workflow/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select * from workflow where id_tramite=?';
    mysqlConection.query(consulta, id, (err, workflowDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Workflow: workflowDb
        })

    })
})

//verificar si tramit ya fue emviado por una cuenta
app.post('/workflow-envio/:id', (req, res) => {
    let id_cuentaEmisor = req.body.id_cuenta
    let id_tramite = req.params.id
    let consulta = 'Select * from workflow where id_tramite=? and id_cuentaEmisor=?';
    mysqlConection.query(consulta, [id_tramite, id_cuentaEmisor], (err, workflowDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Workflow: workflowDb
        })

    })
})





module.exports = app