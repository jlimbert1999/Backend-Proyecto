const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');

const configTwilio = require('../../../config-sms');
const { config } = require('nodemon');
const client = require('twilio')(configTwilio.accountSID, configTwilio.authToken)

//obtener la informacion de un tramite con su codigo para el solicitante
app.get('/consulta-tramite', (req, res) => {
    let pin = req.query.pin
    let dni = req.query.dni
    let consulta = 'Select t1.id_tramite, t3.telefono from tramite as t1 join solicitud as t2 on t2.id_tramite=t1.id_tramite join solicitante as t3 on t3.id_solicitante=t2.id_solicitante where t1.pin=? and t3.dni=?';
    mysqlConection.query(consulta, [pin, dni], (err, tramiteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        client.verify.services(configTwilio.serviceID).verifications.create({
            to: `+591${tramiteDb[0].telefono}`,
            channel: 'sms'

        }).then((data) => {
            res.json({
                ok: true,
                Consulta: tramiteDb[0],
                message: "Se envio el codigo de verificacion"
            })

        })


    })
})

app.get('/verificar-consulta', (req, res) => {
    let numer_tele = req.query.telefono
    let numer_code = req.query.code
    let id_tramite = req.query.id_tramite
    let consulta = 'Select t1.estado, t1.Fecha_creacion, t1.Fecha_finalizacion, t3.nombres, t3.paterno, t3.materno, t3.expedido, t3.dni, t4.titulo from tramite as t1 join solicitud as t2 on t2.id_tramite=t1.id_tramite join solicitante as t3 on t3.id_solicitante=t2.id_solicitante join tipos as t4 on t4.id_TipoTramite=t1.id_TipoTramite where t1.id_tramite=?';
    client.verify.services(configTwilio.serviceID).verificationChecks.create({
        to: `+591${numer_tele}`,
        code: numer_code

    }).then((data) => {
        if (data.valid) {
            mysqlConection.query(consulta, id_tramite, (err, tramiteDb, fields) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: err
                    })
                }
                res.json({
                    ok: true,
                    Tramite: tramiteDb[0]
                })

            })
        } else {
            res.json({
                ok: false,
                message: "El codigo ingresado no es correcto"
            })

        }
    })


})
module.exports = app