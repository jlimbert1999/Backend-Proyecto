const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verificarToken, verificarAdminRol } = require('../../middleware/autorizacion')


//INICIO DE SESION
app.post('/login', (req, res) => {
    let { login, password } = req.body
    let consulta = 'select t1.password, t1.id_funcionario, t1.id_cuenta, t1.login, t2.Nombre as NombreCargo, t3.Nombre, t3.Apellido_P, t3.Apellido_M, t4.tipo, t5.Sigla from cuenta as t1 join cargo as t2 on t2.id_cargo=t1.id_cargo join funcionarios as t3 on t3.id_funcionario=t1.id_funcionario join permisos as t4 on t4.id_cuenta=t1.id_cuenta left join trabaja as tx on tx.id_cuenta=t1.id_cuenta left join institucion as t5 on t5.id_institucion=tx.id_institucion where t1.login=?'
    mysqlConection.query(consulta, login, (err, usuarioDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })

        }
        if (usuarioDB.length < 1) {
            return res.json({
                ok: false,
                message: 'No existe el correo'
            })
        }
        if (!bcrypt.compareSync(password, usuarioDB[0].password)) {
            return res.json({
                ok: false,
                message: 'la contraseña es incorrecta'
            })
        }
        let DatosCuenta = {
            id_cuenta: usuarioDB[0].id_cuenta,
            id_funcionario: usuarioDB[0].id_funcionario,
            Nombre: `${usuarioDB[0].Nombre} ${usuarioDB[0].Apellido_P} ${usuarioDB[0].Apellido_M}`,
            NombreLogin: usuarioDB[0].login,
            NombreCargo: usuarioDB[0].NombreCargo,
            Tipo: usuarioDB[0].tipo,
            Sigla: usuarioDB[0].Sigla
        }
        let token = jwt.sign(DatosCuenta, 'still')
        res.json({
            ok: true,
            usuario: DatosCuenta,
            token
        })
    })
})


//==================ADMINISTRACION DE USUARIOS===========================

//AGREGAR USUARIO
app.post('/api/usuario', verificarToken, verificarAdminRol, (req, res) => {
    const body = req.body
    let consulta = 'INSERT INTO funcionarios set ?';
    mysqlConection.query(consulta, body, (err, usuarioDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            Usuario: usuarioDB,
            message: "Usuario creado exitosamente!"
        })

    })
})

//obtner usuario habilitados o inabilitados
app.get('/api/usuarios', verificarToken, verificarAdminRol, (req, res) => {

    let habilitado = req.query.habilitados
    let consulta = 'SELECT t1.*, t2.id_cuenta from funcionarios as t1 left join cuenta as t2 on t2.id_funcionario=t1.id_funcionario where t1.Activo=? ORDER BY Fecha_creacion DESC;';
    mysqlConection.query(consulta, habilitado, (err, usuariosDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuariosDB <= 0) {
            return res.json({
                ok: true,
                usuarios: []
            })
        }
        res.json({
            ok: true,
            usuarios: usuariosDB
        })
    })
})

//OBTENER 1 USUARIO 
app.get('/usuarios/:id', verificarToken, verificarAdminRol, (req, res) => {
    const id = req.params.id
    let consulta = 'Select * from funcionarios where id_funcionario=?';
    mysqlConection.query(consulta, id, (err, usuarioDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuarioDB <= 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe un usuario con ese ID'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

//get multiple usuarios
app.post('/usuarios-trabajando', verificarToken, verificarAdminRol, (req, res) => {
    const ids = req.body.ids
    let consulta = 'Select * from funcionarios where id_funcionario in (?)';
    mysqlConection.query(consulta, [ids], (err, usuariosDB, fields) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuariosDB <= 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe un usuario con ese ID'
                }
            })
        }
        res.json({
            ok: true,
            usuarios: usuariosDB
        })
    })
})



//ACTUALIZAR USUARIO 
app.put('/api/usuario/:id', verificarToken, verificarAdminRol, (req, res) => {
    const id = req.params.id
    const body = req.body
    let consulta = 'Update funcionarios set ? where id_funcionario=?';
    mysqlConection.query(consulta, [body, id], (err, usuarioDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: "Usuario modificado"
        })

    })
})

//ELIMINAR USUARIO
app.delete('/api/usuarios/:id', (req, res) => {
    const id = req.params.id
    let consulta = 'DELETE from funcionarios where id_funcionario=?';
    mysqlConection.query(consulta, id, (err, usuarioDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: "Funcionaro eliminado"
        })
    })
})

//AGREGAR DE DETALLES DE SU INICIO DE TRABAJO
app.post('/api/usuarios-detalles', verificarToken, verificarAdminRol, (req, res) => {
    let body = req.body
    let consulta = 'INSERT INTO detalles set ?';
    mysqlConection.query(consulta, body, (err, detalleDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: "Detalles de las fechas de trabajo guardados"
        })
    })
})

//OTNER EL REGISTRO DE TRABAJOS DEL FUNCIONARIO
app.get('/api/usuarios-detalles/:id', (req, res) => {
    const id = req.params.id
    let consulta = 'Select t1.detalle, t1.fecha, t3.Nombre as NombreCar from detalles as t1 join cargo as t3 on t3.id_cargo=t1.id_cargo where t1.id_funcionario=?';
    mysqlConection.query(consulta, id, (err, detallesDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            Detalles: detallesDB
        })
    })
})

app.get('/usuarios-detalles', (req, res) => {
    let consulta = 'SELECT * from detalles';
    mysqlConection.query(consulta, (err, detallesDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            Detalles: detallesDB,
            message: "Se obtuvieron los detalles"
        })
    })
})


//obtner info completa cuenta
app.get('/detalles-cuenta/:id', (req, res) => {
    const id = req.params.id
    let consulta = 'SELECT t1.*, t2.Nombre as NombreCargo, t3.Nombre as NombreDep, t4.Nombre as NombreInst, t5.login from cuenta as t5 join funcionarios as t1 on t1.id_funcionario=t5.id_funcionario join trabaja as t6 on t6.id_cuenta=t5.id_cuenta join cargo as t2 on t2.id_cargo=t5.id_cargo join dependencia as t3 on t3.id_dependencia=t6.id_dependencia join institucion as t4 on t4.id_institucion=t6.id_institucion where t5.id_cuenta=?';
    mysqlConection.query(consulta, id, (err, detallesDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            Detalles: detallesDB,
            message: "Se obtuvieron los detalles de la cuenta"
        })
    })
})





module.exports = app