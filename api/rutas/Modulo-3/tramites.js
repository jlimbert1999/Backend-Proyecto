const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');

//TRAMIE
app.post('/tramite', (req, res) => {
    const body = req.body
    let consulta = 'INSERT INTO tramite set ?';
    mysqlConection.query(consulta, body, (err, tramiteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Tramite: tramiteDb,
            message: "Se registro el tramite exitosamente!"
        })

    })
})


//obtener info tramite registrados por una cuenta
app.get('/tramites/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.*, t2.id_solicitud,t3.*, t4.titulo from tramite as t1 join solicitud as t2 on t2.id_tramite=t1.id_tramite join solicitante as t3 on t3.id_solicitante=t2.id_solicitante join tipos as t4 on t4.id_TipoTramite=t1.id_TipoTramite where t1.id_cuenta=?';
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

app.put('/tramite/:id', (req, res) => {
    const id = req.params.id
    let body = req.body
    let consulta = 'Update tramite set ? where id_tramite=?';
    mysqlConection.query(consulta, [body, id], (err, tramiteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Tramite: tramiteDb,
            message: "Se actualizo el tramite exitosamente!"
        })

    })
})

//SOLICITANTE

app.post('/solicitante', (req, res) => {
    const body = req.body
    let consulta = 'INSERT INTO solicitante set ?';
    mysqlConection.query(consulta, body, (err, solicitanteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Solicitante: solicitanteDb,
            message: "Se registro al solicitante exitosamente!"
        })

    })
})


//traer la info de un solicitante
app.get('/solicitante/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.* from solicitante as t1 join solicitud as t2 on t2.id_solicitante=t1.id_solicitante where t2.id_tramite=?';
    mysqlConection.query(consulta, id, (err, solicitanteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Solicitante: solicitanteDb
        })

    })
})

app.put('/solicitante/:id', (req, res) => {
    const id = req.params.id
    let body = req.body
    let consulta = 'Update solicitante set ? where id_solicitante= ?';
    mysqlConection.query(consulta, [body, id], (err, solicitanteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Solicitante: solicitanteDb,
            message: "Se actualizo al solicitante exitosamente!"
        })

    })
})


//REPRESENTANTE
app.post('/representante', (req, res) => {
    const body = req.body
    let consulta = 'INSERT INTO representante set ?';
    mysqlConection.query(consulta, body, (err, represenDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Representante: represenDb,
            message: "Se registro al representante exitosamente!"
        })

    })
})

//traer la info de un representante
app.get('/representante/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.* from representante as t1 join solicitud as t2 on t2.id_representante=t1.id_representante where t2.id_tramite=?';
    mysqlConection.query(consulta, id, (err, representanteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Representante: representanteDb
        })

    })
})
app.put('/representante/:id', (req, res) => {
    const id = req.params.id
    let body = req.body
    let consulta = 'Update representante set ? where id_representante=?';
    mysqlConection.query(consulta, [body, id], (err, representanteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Representante: representanteDb,
            message: "Se actualizo al representante correctamente!"
        })

    })
})


//SOLICITTU= TABLA QUE VINCULA AL TRAMITE CON EL SOLICITANTE

app.post('/solicitud', (req, res) => {
        const body = req.body
        let consulta = 'INSERT INTO solicitud set ?';
        mysqlConection.query(consulta, body, (err, solicitudDb, fields) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.json({
                ok: true,
                Solicitud: solicitudDb,
                message: "Se registro la solicitud de tramite correctamente"
            })

        })
    })
    //actualizar la solicitud agregando un representante
app.put('/solicitud/:id', (req, res) => {
    const id = req.params.id
    let body = req.body
        // console.log(this.body, this.id);
    let consulta = 'Update solicitud set ? where id_solicitud=?';
    mysqlConection.query(consulta, [body, id], (err, solicitudDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Solicitud: solicitudDb,
            message: "Se actualizo la solicitud correctamente"
        })

    })
})


app.post('/workflow', (req, res) => {
    let body = req.body
    let consulta = 'INSERT INTO workflow set ?';
    mysqlConection.query(consulta, body, (err, workflowDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Workflow: workflowDb,
            message: "Se registro el flujo de informacion correctamente"
        })

    })
})


// OBTENCION DE DATOS PARA LA FICHA
app.get('/ficha-tramite/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select * from tramite where id_tramite=?';
    mysqlConection.query(consulta, id, (err, tramiteDb, fields) => {
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
app.get('/ficha-solicitante/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.* from solicitante as t1 join solicitud as t2 on t2.id_solicitante=t1.id_solicitante where t2.id_tramite=?';
    mysqlConection.query(consulta, id, (err, solicitanteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Solicitante: solicitanteDb
        })
    })
})
app.get('/ficha-representante/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.* from representante as t1 join solicitud as t2 on t2.id_representante=t1.id_representante where t2.id_tramite=?';
    mysqlConection.query(consulta, id, (err, representanteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Representante: representanteDb
        })
    })
})
app.get('/ficha-requisitos_presentados/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select presento from solicitud where id_tramite=?';
    let consulta2 = `Select detalle from requerimientos where id_requerimiento in (?)`;
    mysqlConection.query(consulta, id, (err, idsDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        let ids_requerimientos = idsDb[0].presento.split(',').map(Number);
        mysqlConection.query(consulta2, [ids_requerimientos], (err, requisitosDb, fields) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.json({
                ok: true,
                Requerimientos: requisitosDb
            })
        })
    })
})




//metodo para conseguir algunos detalles del tramite y mostrarlos en las bandejas como lista
app.get('/bandeja-recibida/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.id_tramite, t1.detalle, t1.fecha_envio, t1.enviado, t1.recibido, t1.id_cuentaEmisor, t2.alterno, t3.titulo, t4.Nombre, t4.Apellido_P, t4.Apellido_M, t6.Nombre as NombreCargo from workflow as t1 join tramite as t2 on t2.id_tramite=t1.id_tramite join tipos as t3 on t3.id_TipoTramite=t2.id_TipoTramite join cuenta as t5 on t5.id_cuenta=t1.id_cuentaEmisor join  cargo as t6 on t6.id_cargo=t5.id_cargo join funcionarios as t4 on t4.id_funcionario=t5.id_funcionario where t1.id_cuentaReceptor=?';
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
    let consulta = 'Select t1.*, t2.alterno, t2.cantidad, t3.titulo, t5.Nombre, t5.Apellido_P, t5.Apellido_M, t6.Nombre as NombreCargo from workflow as t1 join tramite as t2 on t2.id_tramite=t1.id_tramite join tipos as t3 on t3.id_TipoTramite=t2.id_TipoTramite join cuenta as t4 on t4.id_cuenta=t1.id_cuentaReceptor join funcionarios as t5 on t5.id_funcionario=t4.id_funcionario join cargo as t6 on t6.id_cargo=t4.id_cargo where t1.id_cuentaEmisor=?';
    mysqlConection.query(consulta, id, (err, tramiteDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Tramites: tramiteDb
        })

    })
})

app.get('/detalles-funcionario/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t1.id_cuenta, t2.Nombre, t2.Apellido_P, t2.Apellido_M, t3.Nombre as NombreCar, t4.Nombre as NombreInst, t5.Nombre as NombreDep from cuenta as t1 join funcionarios as t2 on t2.id_funcionario=t1.id_funcionario join cargo as t3 on t3.id_cargo=t1.id_cargo join trabaja as tx on tx.id_cuenta=t1.id_cuenta join institucion as t4 on t4.id_institucion=tx.id_institucion join dependencia as t5 on tx.id_dependencia=t5.id_dependencia where t1.id_cuenta=?';
    mysqlConection.query(consulta, id, (err, funcionarioDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Funcionario: funcionarioDb,
            message: "Se obtuvo el funcionario"
        })

    })
})

app.post('/observacion', (req, res) => {
    const body = req.body
    let consulta = 'INSERT INTO observacion set ?';
    mysqlConection.query(consulta, body, (err, observacionDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Observacion: observacionDb,
            message: "Se registro la observacion"
        })

    })
})

app.get('/observaciones/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'select t1.*, t3.Nombre, t3.Apellido_P, t3.Apellido_M, t4.Nombre as NombreCar from observacion as t1 join cuenta as t2 on t2.id_cuenta=t1.id_cuenta join funcionarios as t3 on t3.id_funcionario=t2.id_funcionario join cargo as t4 on t4.id_cargo=t2.id_cargo where t1.id_tramite=?';
    mysqlConection.query(consulta, id, (err, observacionDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Observaciones: observacionDb,
            message: "Se obtuvieron las observaciones"
        })

    })
})
app.put('/observacion/:id', (req, res) => {
    const id = req.params.id
    let body = req.body
    let consulta = 'Update observacion set ? where id_observacion=?';
    mysqlConection.query(consulta, [body, id], (err, observacionDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            message: "Se actualizo la observacion"
        })

    })
})
app.get('/observacion-usuario/:id', (req, res) => {
    const id = req.params.id
    let consulta = 'Select * from observacion where id_cuenta=?';
    mysqlConection.query(consulta, id, (err, observacionDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Observaciones: observacionDb
        })

    })
})

app.get('/detalles-envio/:id', (req, res) => {

    let id = req.params.id
    let consulta = 'select * from workflow where id_tramite=?';
    mysqlConection.query(consulta, id, (err, workflowDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Workflow: workflowDb,
            message: "Se obtuvieron detalles del  workflow"
        })

    })
})
app.get('/requisitos-presentados/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select t2.detalle from tramite as t1 join requerimientos as t2 on t2.id_TipoTramite=t1.id_TipoTramite where t1.id_tramite=?';
    mysqlConection.query(consulta, id, (err, requisitosDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Requisitos: requisitosDb,
            message: "Se obtuvieron los requisitos"
        })

    })
})

//aceptar tramite
app.put('/workflow/:id', (req, res) => {
        const id = req.params.id
        const body = req.body
        let consulta = 'Update workflow set ? where id_tramite=?';
        mysqlConection.query(consulta, [body, id], (err, usuarioDB, fields) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                message: "Se actualizo el flujo"
            })

        })
    })
    //aceptar tramite
app.put('/workflow-aceptarTramite/:id', (req, res) => {
    const id = req.params.id
    const body = {
        recibido: req.body.recibido,
        fecha_recibido: req.body.fecha_recibido
    }
    const id_cuentaEmisor = req.body.id_cuentaEmisor
    const id_cuentaReceptor = req.body.id_cuentaReceptor
    let consulta = 'Update workflow set ? where id_tramite=? and id_cuentaEmisor=? and id_cuentaReceptor=?';
    mysqlConection.query(consulta, [body, id, id_cuentaEmisor, id_cuentaReceptor], (err, usuarioDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: "Se actualizo el flujo"
        })

    })
})

//metodo para obtener funcionarios de una insitucion y area especifos para el envio de tramite
app.post('/funcionarios_especificos', (req, res) => {

    let id_institucion = req.body.id_institucion
    let id_dependencia = req.body.id_dependencia
    let consulta = 'Select t1.Nombre,t1.Apellido_P, t1.Apellido_M, t2.id_cuenta, t4.Nombre as NombreCar from trabaja as t3 join cuenta as t2 on t2.id_cuenta=t3.id_cuenta join funcionarios as t1 on t1.id_funcionario=t2.id_funcionario join cargo as t4 on t4.id_cargo=t2.id_cargo where id_institucion=? and id_dependencia=?';
    mysqlConection.query(consulta, [id_institucion, id_dependencia], (err, funcionariosDb, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Funcionarios: funcionariosDb,
        })

    })
})

//metodo para obtener requisitos presentados
app.get('/requisitos_presentados/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'select presento from solicitud where id_tramite=?';
    mysqlConection.query(consulta, id, (err, requisitosDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.json({
            ok: true,
            Requisitos: requisitosDB
        })

    })
})



// app.get('/ficha-tramite/:id', (req, res) => {
//     let id = req.params.id
//     let consulta = 'Select t1.*, t2.id_solicitud,t3.nombres, t3.paterno, t3.materno, t4.titulo from tramite as t1 join solicitud as t2 on t2.id_tramite=t1.id_tramite join solicitante as t3 on t3.id_solicitante=t2.id_solicitante join tipos as t4 on t4.id_TipoTramite=t1.id_TipoTramite where t1.id_cuenta=?';
//     mysqlConection.query(consulta, id, (err, tramitesDb, fields) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 message: err
//             })
//         }
//         res.json({
//             ok: true,
//             Tramites: tramitesDb
//         })

//     })
// })


module.exports = app


//get tramites registrados por una funcionario
// app.get('/tramites/:id', (req, res) => {
//     let id = req.params.id
//     let consulta = 'Select t2.*,  t3.titulo, t4.nombres, t4.paterno, t4.materno from solicitud as t1 join tramite as t2 on t2.id_tramite=t1.id_tramite join tipos as t3 on t3.id_TipoTramite=t2.id_TipoTramite join solicitante as t4 on t4.id_solicitante=t1.id_solicitante where t2.id_cuenta=?';
//     mysqlConection.query(consulta, id, (err, tramitesDb, fields) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 message: err
//             })
//         }
//         res.json({
//             ok: true,
//             Tramites: tramitesDb
//         })

//     })
// })

// app.get('/solicitantes/:id', (req, res) => {
//     let id = req.params.id
//     let consulta = 'Select t1.* from solicitante as t1 join solicitud as t2 on t2.id_solicitante=t1.id_solicitante join tramite as t3 on t3.id_tramite=t2.id_tramite where t3.id_cuenta=?';
//     mysqlConection.query(consulta, id, (err, solicitanteDb, fields) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 message: err
//             })
//         }
//         res.json({
//             ok: true,
//             Solicitantes: solicitanteDb
//         })

//     })
// })

// app.get('/representantes/:id', (req, res) => {
//     let id = req.params.id
//     let consulta = 'Select t1.* from representante as t1 join solicitud as t2 on t2.id_representante=t1.id_representante join tramite as t3 on t3.id_tramite=t2.id_tramite where t3.id_cuenta=?';
//     mysqlConection.query(consulta, id, (err, representanteDb, fields) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 message: err
//             })
//         }
//         res.json({
//             ok: true,
//             Representantes: representanteDb
//         })

//     })
// })