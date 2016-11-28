var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var logger = require("morgan");
var url= require("url");
var http = require('http');
var app = express();
// var objeteador = require('./mis_modulos/propiedadesObjeto');
var fs = require('fs');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var servicioDatos_v1 = require("./mis_modulos/contactosServicioDatos_v1");
var servicioDatos_v2 = require("./mis_modulos/contactosServicioDatos_v2");
var expressPaginate = require('express-paginate');
var mongoosePaginate = require('mongoose-paginate');
// Configuración de logs
var logDirectorio = __dirname + "/logs";
fs.statSync(logDirectorio).isDirectory() || fs.mkdir(logDirectorio);
var logStream = fs.createWriteStream(__dirname + "/logs/access.log", {'flags': 'a'});
var purgador = require("./mis_modulos/purgaQuery");
var CacheControl = require("express-cache-control");

// Middleware
var cache = new CacheControl().middleware;
app.use(logger('dev', {stream: logStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressPaginate.middleware(5, 10)); // Default req.query.limit.

// Conexión con la BD
mongoose.connect('mongodb://localhost/contactos');
var mongodb = mongoose.connection;
var gfs = Grid(mongodb.db, mongoose.mongo);


// Schema para los contactos
var contactoSchema = new mongoose.Schema(
    {
        nombre: String,
        apellidos: String,
        telefono: {type: String, index: {unique: true}},
        grupo: [String]
    }
);
// Plugin del schema para paginar resultados.
contactoSchema.plugin(mongoosePaginate);

// Modelo de Contactos para operar en la BD
var Contacto = mongoose.model('Contacto', contactoSchema);

// Request Handler de las direcciones publicadas. Reenvía a la version ACTUAL

app.get('/contactos', function (request, response) {
    var get_params = url.parse(request.url, true).query;
    console.log('redirigiendo a /v2/contactos');
    response.writeHead(302, {'Location': '/v2/contactos/'});
    response.end('La Version actual es la 2 y se encuentra en la URI /v2/contactos/ ');
});

// Request Handler V1

app.get('/v1/contactos/:numTlf', function (request, response) {
    console.log(request.url + " pregunta por: " + request.params.numTlf);
    servicioDatos_v1.encuentraPorNumero(Contacto, request.params.numTlf, response);
});

app.get('/v1/contactos', function (request, response) {
    var get_params = url.parse(request.url, true).query;
    if (Object.keys(get_params).length === 0) {
        console.log("Listado completo, ya que no se envían parámetros");
        servicioDatos_v1.listado(Contacto, response);
    }
    else {
        var parametros = Object.getOwnPropertyNames(get_params);
        console.log("Parametros: " + parametros);
        var primerParametro = parametros[0];
        console.log("Primer Parametro: " + primerParametro);
        var valorPrimerParametro = get_params[primerParametro];
        console.log("Valor primer parametro: " + valorPrimerParametro);
        console.log("El parametro es del tipo " + typeof(valorPrimerParametro));
        servicioDatos_v1.buscaCampo(Contacto, primerParametro, valorPrimerParametro, response);
    }

});


app.post('/v1/contactos', function (request, response) {
    servicioDatos_v1.crea(Contacto, request.body, response)
});

app.put('/v1/contactos', function (request, response) {
    servicioDatos_v1.actualiza(Contacto, request.body, response)
});

app.delete('/v1/contactos/:numTlf', function (request, response) {
    servicioDatos_v1.elimina(Contacto, request.params.numTlf, response);
});

// Request Handler V2.

// Handlers de los Request con número de version en la URL

app.get('/v2/contactos', cache("minutes",5),function (request, response) {
    var get_params = url.parse(request.url, true).query;
    if (Object.keys(get_params).length === 0) {
        console.log("Listado completo, paginado, ya que no se envían parámetros");
        servicioDatos_v2.pagina(Contacto, request, response);
    }
    else {

        console.log("En bruto: " + Object.keys(get_params));
        var queryPurgado = purgador.purga(get_params);
        console.log("Purgado:" + Object.keys(queryPurgado));
        servicioDatos_v2.filtraYpagina(Contacto, queryPurgado, request, response);
    }
});

app.get('/v2/contactos/:numTlf', function (request, response) {
    console.log(request.url + " pregunta por: " + request.params.numTlf);
    servicioDatos_v2.encuentraPorNumero(Contacto, request.params.numTlf, response);
});

app.post('/v2/contactos', function (request, response) {
    servicioDatos_v2.crea(Contacto, request.body, response)
});

app.put('/v2/contactos', function (request, response) {
    servicioDatos_v2.actualiza(Contacto, request.body, response)
});

app.delete('/v2/contactos/:numTlf', function (request, response) {
    servicioDatos_v2.elimina(Contacto, request.params.numTlf, response);
});

app.get('/v2/contactos/:numTlf/imagen', function (request, response) {
    var gfs = Grid(mongodb.db, mongoose.mongo);
    servicioDatos_v2.traeImagen(gfs, request.params.numTlf, response);
});

app.post('/v2/contactos/:numTlf/imagen', function (request, response) {
    var gfs = Grid(mongodb.db, mongoose.mongo);
    servicioDatos_v2.actualizaImagen(gfs, request, response);
});

app.put('/v2/contactos/:numTlf/imagen', function (request, response) {
    var gfs = Grid(mongodb.db, mongoose.mongo);
    servicioDatos_v2.actualizaImagen(gfs, request, response);
});

app.delete('/v2/contactos/:numTlf/imagen', function (request, response) {
    var gfs = Grid(mongodb.db, mongoose.mongo);
    servicioDatos_v2.borraImagen(gfs, mongodb.db, request.params.numTlf, response);
});

http.createServer(app).listen(3000, function(){
    console.log('Servidor Express operativo en puerto 3000');
});