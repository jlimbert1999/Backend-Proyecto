const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const jwt = require('jsonwebtoken');

app.post('/cargo', (req, res) => {
    const body = req.body
    let consulta = 'INSERT INTO cargo set ?';
    mysqlConection.query(consulta, body, (err, cargoDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            cargo: cargoDB,
            message: "Cargo creado exitosamente!"
        })

    })
})

app.get('/api/cargos', (req, res) => {
    let tipo = req.query.tipo
    let consulta = 'SELECT * from cargo where Activo=? ORDER BY Fecha_creacion DESC;';
    mysqlConection.query(consulta, tipo, (err, cargoDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (cargoDB <= 0) {
            return res.json({
                ok: false,
                message: 'No hay cargos registrados'
            })
        }
        res.json({
            ok: true,
            Cargos: cargoDB,
            message: "Se obtuvieron los cargos registrados"
        })
    })
})

app.put('/api/cargo/:id', (req, res) => {
    const id = req.params.id
    const body = req.body
    let consulta = 'Update cargo set ? where id_cargo=?';
    mysqlConection.query(consulta, [body, id], (err, cargoDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            cargo: cargoDB,
            message: "Se actualizaron los datos correctamente"
        })
    })
})

//ELIMINAR
app.delete('/cargo/:id', (req, res) => {
    const id = req.params.id
    let consulta = 'DELETE from cargo where id_cargo=?';
    mysqlConection.query(consulta, id, (err, usuarioDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (err.errno == 1451) {
            return res.json({
                ok: false,
                message: "Existen funcionarios con este cargo"
            })
        }
        res.json({
            ok: true,
            message: "cargo eliminado"
        })
    })
})
module.exports = app