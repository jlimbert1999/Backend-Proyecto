const express = require('express');
const app = express()
const mysqlConection = require('../coneccion/conexionBD');
const jwt = require('jsonwebtoken');
const e = require('express');

app.get('/', (req, res) => {
    res.json('Hello users')
})
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

app.post('/test', verificarToken, (req, res) => {
    console.log(req.usuario)
    res.json('info secreta')
})


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