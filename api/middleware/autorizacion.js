const jwt = require('jsonwebtoken')

//=========VERIFICAR TOKEN==================
let verificarToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, 'still', (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "el token no es valido"
                }
            })
        }
        req.usuario = decoded;
        next()
    })

}
module.exports = {
    verificarToken
}