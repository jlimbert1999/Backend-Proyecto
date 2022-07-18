const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const jwt = require('jsonwebtoken');
const { verificarToken, verificarAdminRol } = require('../../middleware/autorizacion')

app.post('/api/requerimiento', verificarToken, (req, res) => {
    let body = req.body
    let consulta = 'INSERT INTO requerimientos set ?';
    mysqlConection.query(consulta, body, (err, requerimientoDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            Requerimiento: requerimientoDB,
            message: "El requerimiento fue creado exitosamente!"
        })
    })
})

//get requerimietos de tramite habilitados
app.get('/api/requerimientos_Habilitados/:id', verificarToken, (req, res) => {
    let id = req.params.id
    let consulta = 'SELECT * from requerimientos where id_TipoTramite=? and Activo=true';
    mysqlConection.query(consulta, id, (err, requerimientosDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (requerimientosDB <= 0) {
            return res.json({
                ok: true,
                Requerimientos: [],
                message: 'No hay requerimientos registrados'
            })
        }
        res.json({
            ok: true,
            Requerimientos: requerimientosDB,
            message: "Se obtuvieron los requerimientos"
        })
    })
})
app.get('/api/requerimientos_noHabilitados/:id', verificarToken, (req, res) => {
    let id = req.params.id
    let consulta = 'SELECT * from requerimientos where id_TipoTramite=? and Activo=false';
    mysqlConection.query(consulta, id, (err, requerimientosDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (requerimientosDB <= 0) {
            return res.json({
                ok: true,
                Requerimientos: [],
                message: 'No hay requerimientos registrados'
            })
        }
        res.json({
            ok: true,
            Requerimientos: requerimientosDB,
            message: "Se obtuvieron los requerimientos"
        })
    })
})

app.put('/requerimientos/:id', verificarToken, (req, res) => {
    let body = req.body
    const id = req.params.id
    let consulta = 'Update requerimientos set ? where id_requerimiento=?';
    mysqlConection.query(consulta, [body, id], (err, requerimientoDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            Requerimiento: requerimientoDB,
            message: "El requerimiento fue actualizado"
        })
    })
})


app.delete('/requerimientos/:id', verificarToken, (req, res) => {
    const id = req.params.id
    let consulta = 'Delete from requerimientos where id_requerimiento=?';
    mysqlConection.query(consulta, id, (err, requerimientoDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            Requerimiento: requerimientoDB,
            message: "El requerimiento fue eliminado"
        })
    })
})


module.exports = app