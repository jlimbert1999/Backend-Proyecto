const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');


app.get('/reporte_tramites', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.Fecha_creacion, t1.alterno, t1.estado, t2.id_TipoTramite, t2.titulo from tramite as t1 join tipos as t2 on t2.id_TipoTramite=t1.id_TipoTramite';
    mysqlConection.query(consulta, id, (err, tramitesDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Tramites: tramitesDb
        })

    })
})

app.get('/reporte_funcionario', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.id_cuenta, t3.Nombre, t3.Apellido_P, t3.Apellido_M from tramite as t1 join cuenta as t2 on t2.id_cuenta=t1.id_cuenta join funcionarios as t3 on t3.id_funcionario=t2.id_funcionario';
    mysqlConection.query(consulta, id, (err, tramitesDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Tramites: tramitesDb
        })

    })
})
app.get('/reporte_solicitante', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.id_solicitante, t2.nombres, t2.paterno, t2.materno,t2.dni, t2.expedido, t3.titulo from solicitud as t1 join solicitante as t2 on t2.id_solicitante=t1.id_solicitante join tramite as tx on tx.id_tramite=t1.id_tramite join tipos as t3 on t3.id_TipoTramite=tx.id_TipoTramite';
    mysqlConection.query(consulta, id, (err, tramitesDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Tramites: tramitesDb
        })

    })
})

app.post('/reporte_fichaTramite', (req, res) => {
    let { alterno, dni } = req.body
    let consulta = 'Select t1.id_tramite, t1.id_representante, t5.titulo from solicitud as t1 join tramite as t2 on t2.id_tramite=t1.id_tramite join solicitante as t3 on t3.id_solicitante=t1.id_solicitante left join representante as t4 on t4.id_representante=t1.id_representante join tipos as t5 on t5.id_TipoTramite=t2.id_TipoTramite where t2.alterno=? or t3.dni=?';
    mysqlConection.query(consulta, [alterno, dni], (err, reporteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Reporte: reporteDb
        })

    })
})
app.post('/reporte_estado', (req, res) => {
    let { estado } = req.body
    let consulta = 'Select t1.Fecha_creacion, t1.alterno, t1.estado, t2.id_TipoTramite, t2.titulo from tramite as t1 join tipos as t2 on t2.id_TipoTramite=t1.id_TipoTramite where t1.estado=?';
    mysqlConection.query(consulta, estado, (err, tramitesDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Tramites: tramitesDb
        })

    })
})


module.exports = app