const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const jwt = require('jsonwebtoken');
const { verificarToken, verificarAdminRol } = require('../../middleware/autorizacion')

app.post('/institucion', verificarToken, verificarAdminRol, (req, res) => {
    const body = req.body
    let consulta = 'INSERT INTO institucion set ?';
    mysqlConection.query(consulta, body, (err, institucionDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            institucion: institucionDB,
            message: "Institucion creada exitosamente!"
        })

    })
})

app.get('/instituciones/:tipo', (req, res) => {
    let habilitado = req.params.tipo
    let consulta = 'SELECT * from institucion where Activo=?';
    mysqlConection.query(consulta, habilitado, (err, institucionDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (institucionDB <= 0) {
            return res.json({
                ok: true,
                Instituciones: [],
                message: 'No hay instituciones registradas'
            })
        }
        res.json({
            ok: true,
            Instituciones: institucionDB
        })
    })
})

app.get('/institucion-no_habilitados', (req, res) => {
    let consulta = 'SELECT * from institucion where Activo=0';
    mysqlConection.query(consulta, (err, institucionDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (institucionDB <= 0) {
            return res.status(201).json({
                ok: true,
                message: 'No existen instituciones no habilitadas'
            })
        }
        res.json({
            ok: true,
            Institucion: institucionDB,
            message: "Se obtuvieron las instituciones no habilitadas"
        })
    })
})

app.put('/instituciones/:id', (req, res) => {
    const id = req.params.id
    const body = req.body
    let consulta = 'Update institucion set ? where id_institucion=?';
    mysqlConection.query(consulta, [body, id], (err, institucionDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            institucion: institucionDB,
            message: "Se actualizaron los datos correctamente"
        })
    })
})

//ELIMINAR
app.delete('/institucion/:id', (req, res) => {
    const id = req.params.id
    let consulta = 'DELETE from institucion where id_institucion=?';
    mysqlConection.query(consulta, id, (err, usuarioDB, fields) => {
        if (err) {
            if (err.errno == 1451) {
                return res.json({
                    ok: false,
                    message: "La institucion tiene dependecias registradas"
                })
            } else {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
        }
        res.json({
            ok: true,
            message: "Institucion eliminada"
        })
    })
})
module.exports = app