const express = require('express');
const app = express()
const mysqlConection = require('../conexion/conexionBD');
const jwt = require('jsonwebtoken');


//INICIO DE SESION
app.post('/login', (req, res) => {
    let { username, password } = req.body
    let consulta = `select login, id_cuenta from cuenta where login=? and password=?`
    mysqlConection.query(consulta, [username, password], (err, usuarioDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuarioDB.length <= 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El correo ingresado no existe'
                }
            })
        }
        // if (password !== usuarioDB.password) {
        //     return res.status(400).json({
        //         ok: false,
        //         err: {
        //             message: 'La contraña ingresada es incorrecta'
        //         }
        //     })
        // }
        let token = jwt.sign({ usuario: usuarioDB }, 'still')
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
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

//MOSTRAR USUARIOS
app.get('/usuarios', (req, res) => {
    let consulta = 'SELECT * from funcionarios';
    mysqlConection.query(consulta, (err, usuariosDB, fields) => {
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
                    message: 'No hay usuarios registrados'
                }
            })
        }
        res.json({
            ok: true,
            usuarios: usuariosDB,
            message: "Se obtuvieron a los usuarios registrados"
        })
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
            message: "Usuario eliminado"
        })
    })
})

// app.post('/test', verificarToken, (req, res) => {
//     console.log(req.usuario)
//     res.json('info secreta')
// })


//FUNCION PARA VERIFICAR EL TOKEN

function verificarToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No autorizado'
            }
        })
    }
    let token = req.headers.authorization.substr(7); //token 
    if (token === '') {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Token vacio'
            }
        })
    }
    jwt.verify(token, 'still', (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "el token no es valido"
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })

}

module.exports = app