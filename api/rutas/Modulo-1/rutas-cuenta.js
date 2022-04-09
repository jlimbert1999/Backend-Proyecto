const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JSON } = require('mysql/lib/protocol/constants/types');

//AGREGAR CUENTA
app.post('/cuentas', (req, res) => {
    const body = req.body
    body.password = bcrypt.hashSync(body.password, 10)
    let consulta = 'INSERT INTO cuenta set ?';
    mysqlConection.query(consulta, body, (err, cuentaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            cuenta: cuentaDB,
            message: "Funcionario y cuenta creada exitosamente!"
        })
    })
})

//ACTUALIZAR LOGIN Y PASSWORD CUENTA
app.put('/cuentas/:id', (req, res) => {
    let id = req.params.id
    const body = req.body
    if (body.password) {
        body.password = bcrypt.hashSync(body.password, 10)
    }
    let consulta = 'Update cuenta set ? where id_cuenta=?';
    mysqlConection.query(consulta, [body, id], (err, cuentaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            cuenta: cuentaDB,
            message: "Cuenta actualizada correctamente!"
        })
    })
})


//OBTNER TODOS LOS DATOS DE LAS CUENTAS CON FUNCIONARIOS ACTIVOS
app.get('/cuentas-asignadas', (req, res) => {
    //cuenta = todo | t1
    //funcionario=Nombre, Apellido_P, Apellido_M , Dni| t2
    //trabaja = id_dependencia, id_insitucion | t3
    //institucion=Nombre | t4
    //dependencia=Nombre | t5
    //cargo=nombre | t6
    let consulta = 'SELECT t1.id_cuenta, t1.login, t1.id_funcionario, t1.id_cargo,  t2.Nombre, t2.Apellido_P, t2.Apellido_M, t2.Dni, t4.Sigla as SiglaInst, t5.Nombre as NombreDep, t6.Nombre as NombreCar from cuenta as t1 join funcionarios as t2 on t1.id_funcionario=t2.id_funcionario join trabaja as t3 on t3.id_cuenta=t1.id_cuenta join institucion as t4 on t4.id_institucion=t3.id_institucion join dependencia as t5 on t5.id_dependencia=t3.id_dependencia join cargo as t6 on t6.id_cargo=t1.id_cargo where t1.id_funcionario is not null';
    mysqlConection.query(consulta, (err, cuentasDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (cuentasDB <= 0) {
            return res.json({
                ok: true,
                Cuentas: []
            })
        }
        res.json({
            ok: true,
            Cuentas: cuentasDB
        })
    })
})

//OBTNER TODOS LOS DATOS DE LAS CUENTAS SIN UN FUNCIONARIO ASIGNADO
app.get('/cuentas-no_asignadas', (req, res) => {
    let consulta = 'SELECT t1.login, t1.id_cuenta, t1.id_cargo,  t3.Sigla as SiglaInst, t4.Nombre as NombreDep, t5.Nombre as NombreCar from cuenta as t1 join trabaja as t2 on t1.id_cuenta=t2.id_cuenta join institucion as t3 on t3.id_institucion=t2.id_institucion join dependencia as t4 on t4.id_dependencia=t2.id_dependencia join cargo as t5 on t5.id_cargo=t2.id_cargo  where t1.id_funcionario is null';
    mysqlConection.query(consulta, (err, cuentasDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (cuentasDB <= 0) {
            return res.json({
                ok: true,
                Cuentas: []
            })
        }
        res.json({
            ok: true,
            Cuentas: cuentasDB
        })
    })
})

//VERIFICAR SI FUNCIONARIO TIENE CUENTA
app.get('/cuentas-verificar/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Select id_cuenta, fecha_creacion, fecha_actualizacion, login from cuenta where id_funcionario=?';
    mysqlConection.query(consulta, id, (err, cuentaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (cuentaDB <= 0) {
            return res.json({
                ok: true,
                tiene: false,
                message: "El funcionario no tiene cuenta"
            })
        }
        res.json({
            ok: true,
            tiene: true,
            Cuenta: cuentaDB,
            Propietario: id
        })
    })
})

//QUITAR ID FUNCIONARIO PARA DESVINCULARLO DE LA CUENTA
app.put('/cuentas-finalizar/:id', (req, res) => {
    let id = req.params.id
    let consulta = 'Update cuenta set id_funcionario=null, login="Sin asignar" where id_cuenta=?';
    mysqlConection.query(consulta, id, (err, cuentaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: 'La cuenta fue desvinculada del funcionario'
        })
    })
})




app.put('/cuentas-asignar/:id', (req, res) => { //Actualizar id de funcionarioa a la cuenta para tener el control de esta
    let id = req.params.id
    let body = req.body
    let consulta = 'Update cuenta set ? where id_cuenta=?';
    mysqlConection.query(consulta, [body, id], (err, cuentaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            Cuenta: cuentaDB,
            message: 'Cuenta asignada correctamente!'
        })
    })
})



app.get('/cuentas', (req, res) => {
    let consulta = 'SELECT id_cuenta, login, activo, id_cargo, id_funcionario from cuenta';
    let ids_funcionarios = []
    let CuentasActivas = []
    let CuentasInactivas = []
    let DatosCuenta = []
    let id_cargo = [],
        id_inst = [],
        id_dep = []
    mysqlConection.query(consulta, (err, cuentasDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (cuentasDB <= 0) {
            return res.json({
                ok: false,
                message: "No hay cuentas"
            })

        }

        cuentasDB.forEach((cuenta, index) => {
            if (cuenta.id_funcionario) { //3
                ids_funcionarios.push(cuenta.id_funcionario) //3
                id_cargo.push(cuenta.id_cargo)
                DatosCuenta[index] = { //arreglo donde se armaran los datos 
                    Id_Fun: cuenta.id_funcionario,
                    Dni: '',
                    Nombre: '',
                    Login: cuenta.login,
                    Cargo: cuenta.id_cargo,
                    SiglaInst: '',
                    Dependencia: ''
                };
            }
        });

        //obtener los datos nombre apellido en base a los id de las cuentas
        consulta = 'SELECT Nombre, Apellido_P, Apellido_M, Dni, id_funcionario from funcionarios where id_funcionario in (?)';
        mysqlConection.query(consulta, [ids_funcionarios], (err, funcionariosDB, fields) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (funcionariosDB <= 0) {
                return res.json({
                    ok: false,
                    message: "Los funcionarios con esos ids no existen"
                })
            }
            funcionariosDB.forEach((funcionario, index) => {
                DatosCuenta[index].Nombre = `${funcionario.Nombre} ${funcionario.Apellido_P} ${funcionario.Apellido_M}`
                DatosCuenta[index].Dni = funcionario.Dni
            })
        })

        //Obtner los ids de tabla trabaja para luego recuperar sus nombres
        consulta = 'SELECT * from trabaja where id_funcionario in (?)';
        mysqlConection.query(consulta, [ids_funcionarios], (err, trabajosDB, fields) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (trabajosDB <= 0) {
                return res.json({
                    ok: false,
                    message: "No hay trabajos con esos IDs"
                })
            }
            trabajosDB.forEach((trabaja, index) => {
                id_inst.push(trabaja.id_institucion);
                id_dep.push(trabaja.id_dependencia);
                DatosCuenta[index].SiglaInst = trabaja.id_institucion
                DatosCuenta[index].Dependencia = trabaja.id_dependencia
            });

            //Obtner nombre del cargo en base al id_cargo
            consulta = 'SELECT Nombre, id_cargo from cargo where id_cargo in (?)'
            mysqlConection.query(consulta, [id_cargo], (err, cargosDB, fields) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                if (cargosDB <= 0) {
                    return res.status(200).json({
                        ok: false,
                        message: "No cargos con esos ids"
                    })
                }

                cargosDB.forEach(cargo => {
                    DatosCuenta.forEach((datos, index) => {
                        if (datos.Cargo == cargo.id_cargo) {
                            DatosCuenta[index].Cargo = cargo.Nombre
                        }
                    })
                });
                // console.log(DatosCuenta);
            })

            //obtner nombre dependencia
            consulta = 'SELECT Nombre, id_dependencia from dependencia where id_dependencia in (?)'
            mysqlConection.query(consulta, [id_dep], (err, dependenciasDB, fields) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                if (dependenciasDB <= 0) {
                    return res.status(200).json({
                        ok: false,
                        message: "No depedencias con esos ids"
                    })
                }

                dependenciasDB.forEach(dep => {
                    DatosCuenta.forEach((datos, index) => {
                        if (datos.Dependencia == dep.id_dependencia) {
                            DatosCuenta[index].Dependencia = dep.Nombre
                        }
                    })
                });
                console.log(DatosCuenta);
            })


            //obtner sigla de la isntitucion
            consulta = 'SELECT Sigla, id_institucion from institucion where id_institucion in (?)'
            mysqlConection.query(consulta, [id_inst], (err, instsDB, fields) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                if (instsDB <= 0) {
                    return res.status(200).json({
                        ok: false,
                        message: "No cargos con esos ids"
                    })
                }

                instsDB.forEach(inst => {
                    DatosCuenta.forEach((datos, index) => {
                        if (datos.SiglaInst == inst.id_institucion) {
                            DatosCuenta[index].SiglaInst = inst.Sigla
                        }
                    })
                });
                res.json({
                    ok: true,
                    DatosCuenta
                });
                // console.log("Fina 1", DatosCuenta);


            })

        })


    })








})

//METODOS PARA INSERTAR A TABAL TRABAJO
app.post('/cuentas/trabajos', (req, res) => {
    const body = req.body
    let consulta = 'INSERT INTO trabaja set ?';
    mysqlConection.query(consulta, body, (err, trabajoDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            trabajo: trabajoDB,
            message: "el trabajo fue registrado!"
        })

    })
})

app.get('/cuentas/trabajos', (req, res) => {
    let consulta = 'SELECT * from trabaja';
    mysqlConection.query(consulta, (err, trabajosDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            trabajos: trabajosDB,
            message: "Se obtuvieron los datos de trabajos"
        })

    })
})

app.get('/cuentas/trabajos/:id', (req, res) => {
    const id = req.params.id
    let consulta = 'SELECT * from trabaja where id_funcionario=?';
    mysqlConection.query(consulta, id, (err, trabajoDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (trabajoDB <= 0) {
            return res.json({
                ok: false,
                message: "No existe un funcionario con ese id Trabajando"
            })
        }
        res.json({
            ok: true,
            trabajo: trabajoDB
        })

    })
})
module.exports = app