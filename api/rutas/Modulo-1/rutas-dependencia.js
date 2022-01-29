const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const jwt = require('jsonwebtoken');

app.post('/dependencia', (req, res) => {
    const body = req.body
    console.log(body);
    let consulta = 'INSERT INTO dependencia set ?';
    mysqlConection.query(consulta, body, (err, dependenciaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            dependencia: dependenciaDB,
            message: "Dependencia creada exitosamente!"
        })

    })
})

app.get('/dependencias/:tipo', (req, res) => {
    let habilitado = req.params.tipo
    let consulta = 'SELECT t1.*, t2.Sigla as SiglaInst from dependencia as t1 join institucion as t2 on t1.id_institucion=t2.id_institucion where t1.Activo=?';
    mysqlConection.query(consulta, habilitado, (err, dependenciaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (dependenciaDB <= 0) {
            return res.json({
                ok: false,
                message: 'No hay dependencias registrados'
            })
        }
        res.json({
            ok: true,
            Dependencias: dependenciaDB,
            message: "Se obtuvieron las dependencias registradas"
        })
    })
})

app.put('/dependencias/:id', (req, res) => {
    const id = req.params.id
    const body = req.body
    let consulta = 'Update dependencia set ? where id_dependencia=?';
    mysqlConection.query(consulta, [body, id], (err, dependenciaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            dependencia: dependenciaDB,
            message: "Se actualizaron los datos correctamente"
        })
    })
})

app.delete('/dependencia/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    // DELETE FROM `pruebabd`.`dependencia` WHERE (`id_dependencia` = '3');
    let consulta = 'DELETE from dependencia where id_dependencia=?';
    mysqlConection.query(consulta, id, (err, dependenciaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: "Dependencia eliminada",
            usr: dependenciaDB
        })
    })
})

module.exports = app