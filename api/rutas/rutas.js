const express = require('express')
const app = express()

//importacion de rutas
app.use(require('./Modulo-1/rutas-usuario')); //rutas usuario
app.use(require('./Modulo-1/rutas-institucion')); //rutas institucion
app.use(require('./Modulo-1/rutas-dependencia'));
app.use(require('./Modulo-1/rutas-cargo'))
app.use(require('./Modulo-1/rutas-cuenta'))
app.use(require('./Modulo-1/rutas-permisos'))
app.use(require('./Modulo-3/tramites'))
app.use(require('./Modulo-3/consultas'))
app.use(require('./Modulo-3/bandeja'))
app.use(require('./Modulo-2/rutas-registroTramite'));
app.use(require('./Modulo-2/rutas-Requerimientos'));
app.use(require('./Modulo-2/rutas-TiposTramites'));
app.use(require('./Modulo-4/workflow'));
app.use(require('./Modulo-4/repor'));
app.use(require('./Modulo-5/reportes'));

module.exports = app