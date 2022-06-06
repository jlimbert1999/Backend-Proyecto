const app = require('./app')
const server = require('http').Server(app);
const socketIO = require('socket.io')(server, {
    cors: {
        origin: true,
        credential: true,
        methods: ["GET", "POST"]
    }
});
const { Usuarios } = require('./api/class/usuarios');
const usuarios = new Usuarios


//Servicio colaborativo
socketIO.on('connection', (client) => {
    client.on('unirse', (infoUser, callback) => {
        if (!infoUser.id_cuenta || !infoUser.Nombre || !infoUser.NombreCargo) {
            return callback({
                error: true,
                message: "el id_cuenta/nombre/cargo es necesario"
            })
        }
        usuarios.agregarPersona(client.id, infoUser.id_cuenta, infoUser.Nombre, infoUser.NombreCargo) //client.id es unico de los sockets
        client.broadcast.emit('listar', usuarios.getPersonas())
        callback(usuarios.getPersonas())

    })

    client.on('getUsers_Activos', (infoUser, callback) => {
        callback(usuarios.getPersonas())
    })
    client.on('eliminarUser', (id) => {
        usuarios.quitarUser(id)
        client.broadcast.emit('listar', usuarios.getPersonas())
    })

    client.on('enviarTramite', (data) => {
        let id_receptor = data.id_receptor
        let Tramite = data.Tramite
        client.broadcast.to(id_receptor).emit('recibirTramite', Tramite) //to para envviar a user especifico
    })
    client.on('disconnect', () => {
        let personaBorrada = usuarios.deletePersona(client.id)
        client.broadcast.emit('listar', usuarios.getPersonas())
    })
})


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Servidor iniciado en el puerto:", port)
})





// const http = require('http');
// const socketIO = require('socket.io');

// let server = http.createServer(app);

// // IO = esta es la comunicacion del backend
// module.exports.io = socketIO(server);
// require('./sockets/socket');

// const port = process.env.PORT || 3000;
// server.listen(port, () => {
//     console.log("Servidor iniciado en el puerto:", port)
// })