var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var logger = require("morgan");
var url= require("url");
var http = require('http');
var app = express();
// var objeteador = require('./mis_modulos/propiedadesObjeto');
var mongoose = require('mongoose');
var servicioDatos = require("./mis_modulos/contactosServicioDatos_v1");

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

// Inserción de prueba - OK
// var Nena = new Contacto;
// Nena.nombre = "Miguel";
// Nena.apellidos = "Gastalver Trujillo";
// Nena.telefono = "609181541";
// Nena.grupo = ["Abogados"];
// Nena.save();


// Request Handler

app.get('/v1/contactos/:numTlf', function (request, response) {
    console.log(request.url + " pregunta por: " + request.params.numTlf);
    servicioDatos.encuentraPorNumero(Contacto, request.params.numTlf, response);
});

app.get('/v1/contactos', function (request, response) {
    var get_params = url.parse(request.url, true).query;
    if (Object.keys(get_params).length === 0) {
        console.log("Listado completo, ya que no se envían parámetros");
        servicioDatos.listado(Contacto, response);
    }
    else {
        var parametros = Object.getOwnPropertyNames(get_params);
        console.log("Parametros: " + parametros);
        var primerParametro = parametros[0];
        console.log("Primer Parametro: " + primerParametro);
        var valorPrimerParametro = get_params[primerParametro];
        console.log("Valor primer parametro: " + valorPrimerParametro);
        console.log("El parametro es del tipo " + typeof(valorPrimerParametro));
        servicioDatos.buscaCampo(Contacto, primerParametro, valorPrimerParametro, response);
    }

});


app.post('/v1/contactos', function (request, response) {
    servicioDatos.crea(Contacto, request.body, response)
});

app.put('/v1/contactos', function (request, response) {
    servicioDatos.actualiza(Contacto, request.body, response)
});

app.delete('/v1/contactos/:numTlf', function (request, response) {
    servicioDatos.elimina(Contacto, request.params.numTlf, response);
});

http.createServer(app).listen(3000, function(){
    console.log('Servidor Express operativo en puerto 3000');
});