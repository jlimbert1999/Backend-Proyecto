const mysql = require('mysql')
const mysqlConection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234jose',
    database: 'pruebaBD',
    port: '3306'
})
mysqlConection.connect((err) => {
    if (err) {
        console.log('Error conexion con la Base de Datos:', err);
        return;
    }
    console.log('Conexion a la Base de Datos exitosa!')
})

module.exports = mysqlConection