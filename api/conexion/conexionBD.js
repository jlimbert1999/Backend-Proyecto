const mysql = require('mysql')
const mysqlConection = mysql.createConnection({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'bf0c5a31b08c6c',
    password: 'f53e2b4b',
    database: 'heroku_dc70b0c55510019?reconnect=true'
        // port: '3306'
})

mysqlConection.connect((err) => {
    if (err) {
        console.log('Error conexion con la Base de Datos:', err);
        return;
    }
    console.log('Conexion a la Base de Datos exitosa!')
})

module.exports = mysqlConection