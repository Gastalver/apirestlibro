var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var logger = require("morgan");
var url= require("url");
var http = require('http');
var app = express();
// var objeteador = require('./mis_modulos/propiedadesObjeto');
var mongoose = require('mongoose');
var servicioDatos_v1 = require("./mis_modulos/contactosServicioDatos_v1");
var servicioDatos_v2 = require("./mis_modulos/contactosServicioDatos_v2");

// Middleware
app.use(logger('dev')); // Logs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Conexión con la BD
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/contactos');

// Schema para los contactos
var contactoSchema = new mongoose.Schema(
    {
        nombre: String,
        apellidos: String,
        telefono: {type: String, index: {unique: true}},
        grupo: [String]
    }
);

// Modelo de Contactos para operar en la BD
var Contacto = mongoose.model('Contacto', contactoSchema);

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

// Redirección mientras desarrollamos nueva versión
// app.get('/contactos', function(request, response) {
// response.writeHead(301, {'Location' : '/vX/contactos/'});
// response.end('API Version X-1 movida a /vX/contactos/: ');
// });

// Request Handler V2

app.get('/contactos', function (request, response) {
    var get_params = url.parse(request.url, true).query;
    if (Object.keys(get_params).length === 0) {
        console.log("Listado completo, ya que no se envían parámetros");
        servicioDatos_v2.listado(Contacto, response);
    }
    else {
        var primerParametro = Object.keys(get_params)[0];
        console.log("Primer Parametro: " + primerParametro);
        var valorPrimerParametro = get_params[primerParametro];
        console.log("Valor primer parametro: " + valorPrimerParametro);
        console.log("El parametro es del tipo " + typeof(valorPrimerParametro));
        servicioDatos_v2.buscaCampo(Contacto, primerParametro, valorPrimerParametro, response);
    }

});


http.createServer(app).listen(3000, function(){
    console.log('Servidor Express operativo en puerto 3000');
});