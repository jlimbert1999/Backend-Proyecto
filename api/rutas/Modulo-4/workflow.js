const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const { verificarToken } = require('../../middleware/autorizacion')
    //CONFIGURACION MOTOR DE WORKFLOW
app.get('/workflow/:id', verificarToken, (req, res) => {
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





module.exports = app