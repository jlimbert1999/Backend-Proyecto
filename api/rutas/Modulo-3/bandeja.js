const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');

//agregar a la bandeja entrada
app.post('/add_bandeja_entrada', (req, res) => {
    let body = req.body
    let consulta = 'INSERT INTO bandeja_entrada set ? on duplicate key update ?';
    mysqlConection.query(consulta, [body, body, body.id_tramite], (err, bandejaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Bandeja: bandejaDB
        })

    })
})
app.post('/add_bandeja_salida', (req, res) => {
    let body = req.body
    let consulta = 'INSERT INTO bandeja_salida set ?';

    mysqlConection.query(consulta, body, (err, bandejaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Bandeja: bandejaDB
        })

    })
})

//NUEVO METODO PARA RECUPERAR TRAMITES
app.get('/bandeja-recibida/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.id_tramite, t1.detalle, t1.fecha_envio, t1.aceptado, t1.id_cuentaEmisor, t2.alterno, t2.estado, t3.titulo, t4.Nombre, t4.Apellido_P, t4.Apellido_M, t6.Nombre as NombreCargo from bandeja_entrada as t1 join tramite as t2 on t2.id_tramite=t1.id_tramite join tipos as t3 on t3.id_TipoTramite=t2.id_TipoTramite join cuenta as t5 on t5.id_cuenta=t1.id_cuentaEmisor join  cargo as t6 on t6.id_cargo=t5.id_cargo join funcionarios as t4 on t4.id_funcionario=t5.id_funcionario where t1.id_cuentaReceptor=? and t2.activo is not true'
    mysqlConection.query(consulta, id, (err, tramitesDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (tramitesDb.length == 0) {
            return res.json({
                ok: true,
                Tramites_Recibidos: [],
                message: 'Esta cuenta no tiene tramites recibidos'
            })

        }
        res.json({
            ok: true,
            Tramites_Recibidos: tramitesDb,
        })

    })
})
app.get('/bandeja-emitida/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.*, t2.alterno, t3.titulo, t4.Nombre, t4.Apellido_P, t4.Apellido_M, t6.Nombre as NombreCargo from bandeja_salida as t1 join tramite as t2 on t2.id_tramite=t1.id_tramite join tipos as t3 on t3.id_TipoTramite=t2.id_TipoTramite join cuenta as t5 on t5.id_cuenta=t1.id_cuentaReceptor join  cargo as t6 on t6.id_cargo=t5.id_cargo join funcionarios as t4 on t4.id_funcionario=t5.id_funcionario where t1.id_cuentaEmisor=? ORDER BY fecha_envio DESC;'
    mysqlConection.query(consulta, id, (err, tramitesDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (tramitesDb.length == 0) {
            return res.json({
                ok: true,
                Tramites_Recibidos: [],
                message: 'Esta cuenta no tiene tramites recibidos'
            })

        }
        res.json({
            ok: true,
            Tramites_Recibidos: tramitesDb,
        })

    })
})
app.post('/rechazar_tramite', (req, res) => {
    let { id_tramite, id_cuentaEmisor, id_cuentaReceptor } = req.body
    let consulta = 'delete from bandeja_entrada where id_tramite=? and id_cuentaEmisor=? and id_cuentaReceptor=?'
    let consulta2 = 'update bandeja_salida set rechazado=1 where id_tramite=? and id_cuentaEmisor=? and id_cuentaReceptor=? and aceptado!=true'
    mysqlConection.query(consulta, [id_tramite, id_cuentaEmisor, id_cuentaReceptor], (err, tramitesDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "error en consulta de eliminacion",
                err
            })
        }
        mysqlConection.query(consulta2, [id_tramite, id_cuentaEmisor, id_cuentaReceptor], (err, tramitesDb, fields) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: "error en consulta de actualizacion",
                    err
                })
            }

        })
        res.json({
            ok: true,
            message: "Tramite rechazado"
        })


    })
})

app.post('/aceptar_tramite', (req, res) => {
    let { id_tramite, id_cuentaEmisor, id_cuentaReceptor, data_update_bandejaEntrada, data_update_badejaSalida } = req.body
        // let consulta1 = 'update bandeja_entrada set ? where id_tramite=?'
        // let consulta2 = 'update bandeja_salida set ? where id_tramite=? and id_cuentaEmisor=? and id_cuentaReceptor=?'
    let consultaX = 'update bandeja_entrada as t1, bandeja_salida as t2 set t1.aceptado=true, t1.fecha_recibido=?, t2.aceptado=true, t2.fecha_recibido=? where t1.id_tramite=? and t2.id_tramite=? and t2.id_cuentaEmisor=? and t2.id_cuentaReceptor=?'
    mysqlConection.query(consultaX, [data_update_bandejaEntrada.fecha_recibido, data_update_badejaSalida.fecha_recibido, id_tramite, id_tramite, id_cuentaEmisor, id_cuentaReceptor], (err, tramitesDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "error en consulta de aceptacion de tramite",
                err
            })
        }
        // mysqlConection.query(consulta2, [data_update_badejaSalida, id_tramite, id_cuentaEmisor, id_cuentaReceptor], (err, tramitesDb, fields) => {
        //     if (err) {
        //         return res.status(400).json({
        //             ok: false,
        //             message: "error en consulta de actualizacion bandeja salida",
        //             err
        //         })
        //     }
        //     res.json({
        //         ok: true,
        //         message: "Tramite aceptado"
        //     })
        // })
        res.json({
            ok: true,
            message: "Tramite aceptado",
            tramitesDb
        })



    })
})
module.exports = app