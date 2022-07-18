const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const jwt = require('jsonwebtoken');
const { verificarToken, verificarAdminRol } = require('../../middleware/autorizacion')

app.post('/api/tipos_tramites', verificarToken, (req, res) => {
    let body = req.body
    let consulta = 'INSERT INTO tipos set ?';
    mysqlConection.query(consulta, body, (err, tipoTramiteDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            TipoTramite: tipoTramiteDB,
            message: "El tipo de tramite fue creado exitosamente!"
        })
    })
})

//obtner tramites habilitados y no habilitados
app.get('/api/tipos_tramites', verificarToken, (req, res) => {
    let tipo = req.query.tipo
    let consulta = 'SELECT * from tipos where activo=? ORDER BY Fecha_creacion DESC;';
    mysqlConection.query(consulta, tipo, (err, tiposTramitesDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            TiposTramites: tiposTramitesDB,
            message: "Se obtuvieron a los tipos de tramites registrados"
        })
    })
})

//Actualizar un tipo de tramite
app.put('/api/tipos_tramites/:id', verificarToken, (req, res) => {
    let body = req.body
    const id = req.params.id
    let consulta = 'Update tipos set ? where id_TipoTramite=?';
    mysqlConection.query(consulta, [body, id], (err, tipoTramiteDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            TipoTramite: tipoTramiteDB,
            message: "El tipo de tramite fue actualizado exitosamente!"
        })
    })
})

//Eliminar un tipo de tramite
app.put('/eliminar_tipo_tramite/:id', verificarToken, (req, res) => {
    const id = req.params.id
    let consulta = 'Update tipos set Activo=false where id_TipoTramite=?';
    mysqlConection.query(consulta, id, (err, tipoTramiteDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            TipoTramite: tipoTramiteDB,
            message: "El tipo de tramite fue eliminado"
        })
    })
})
module.exports = app