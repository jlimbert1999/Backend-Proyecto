const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verificarToken } = require('../../middleware/autorizacion')


//INICIO DE SESION
app.post('/login', (req, res) => {
    let { login, password } = req.body
    console.log(req.body);
    let consulta = 'select password, id_funcionario, id_cargo from cuenta where login=?'
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
        let datosUsuario = {
            id_cargo: usuarioDB[0].id_cargo,
            id_funcionario: usuarioDB[0].id_funcionario,
            NombreUser: login
        }
        let token = jwt.sign(datosUsuario, 'still')
        res.json({
            ok: true,
            usuario: datosUsuario,
            token
        })
    })
})

app.get('/test', verificarToken, (req, res) => {
    return res.json({
        usuarios: req.usuario
    })


})


//==================ADMINISTRACION DE USUARIOS===========================

//AGREGAR USUARIO
app.post('/usuarios', (req, res) => {
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
            usuario: usuarioDB,
            message: "Usuario creado exitosamente!"
        })

    })
})

//obtner usuario habilitados o inabilitados
app.get('/usuarios/:tipo', (req, res) => {
    let habilitado = req.params.tipo
    let consulta = 'SELECT * from funcionarios where Activo=?';
    mysqlConection.query(consulta, habilitado, (err, usuariosDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuariosDB <= 0) {
            return res.json({
                ok: false,
                message: 'No hay usuarios registrados'
            })
        }

        res.json({
            ok: true,
            usuarios: usuariosDB,
            message: "Se obtuvieron a los funcionarios"
        })
        console.log(usuariosDB);
    })
})

//OBTENER 1 USUARIO 
app.get('/usuarios/:id', (req, res) => {
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
app.post('/usuarios-trabajando', (req, res) => {
    const ids = req.body.ids
    console.log(ids);
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
app.put('/usuarios/:id', (req, res) => {
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
app.delete('/usuarios/:id', (req, res) => {
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
app.post('/usuarios-detalles', (req, res) => {
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
app.get('/usuarios-detalles/:id', (req, res) => {
    const id = req.params.id
    let consulta = 'Select t1.detalle, t1.fecha, t2.Nombre as Nombre, t2.Apellido_P, t2.Apellido_M, t3.Nombre as NombreCar  from detalles as t1 join funcionarios as t2 on t2.id_funcionario=t1.id_funcionario join cargo as t3 on t3.id_cargo=t1.id_cargo where t1.id_funcionario=?';
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





module.exports = app