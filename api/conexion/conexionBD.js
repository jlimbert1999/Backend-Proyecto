const mysql = require('mysql')
const mysqlConection = mysql.createPool({
    // host: 'localhost',
    // user: 'root',
    // password: '1234jose',
    // database: 'pruebabd',
    // port: '3306'
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'bf0c5a31b08c6c',
    password: 'f53e2b4b',
    database: 'heroku_dc70b0c55510019'
        // port: '3306'
})

mysqlConection.getConnection((err) => {
    if (err) {
        console.log('Error conexion con la Base de Datos:', err);
        return;
    }
    console.log('Conexion a la Base de Datos exitosa!')
})

module.exports = mysqlConection