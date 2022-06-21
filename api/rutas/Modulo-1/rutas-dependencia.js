const express = require('express');
const app = express()
const mysqlConection = require('../../conexion/conexionBD');
const jwt = require('jsonwebtoken');

app.post('/api/dependencia', (req, res) => {
    const body = req.body
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

app.get('/api/dependencias', (req, res) => {
    let habilitado = req.query.tipo
    let consulta = 'SELECT t1.*, t2.Sigla as SiglaInst from dependencia as t1 join institucion as t2 on t1.id_institucion=t2.id_institucion where t1.Activo=? ORDER BY Fecha_creacion DESC;';
    mysqlConection.query(consulta, habilitado, (err, dependenciaDB, fields) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (dependenciaDB <= 0) {
            return res.json({
                ok: true,
                Dependencias: [],
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

app.put('/dependencia/:id', (req, res) => {
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

//obtener las dependencias de una institucion
app.get('/api/dependencias-activas-institucion/:id', (req, res) => {
    // console.log('ds');
    // console.log(req.params.id);
    let id_institucion = req.params.id
    let consulta = 'SELECT Nombre, id_dependencia from dependencia where id_institucion=? and Activo=true';
    mysqlConection.query(consulta, id_institucion, (err, dependenciaDB, fields) => {
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
            Dependencias: dependenciaDB
        })
    })
})

module.exports = app