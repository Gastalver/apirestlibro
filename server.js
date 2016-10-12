var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var logger = require("morgan");
var url= require("url");
var http = require('http');
var app = express();
var agenda = require('./mis_modulos/contactos');
var objeteador = require('./mis_modulos/propiedadesObjeto');
var mongoose = require('mongoose');

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
var contacto = mongoose.model('contacto',contactoSchema);


// Middleware
app.use(logger('dev')); // Logs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Creación de una instancia de documento con el modelo contactoEjemplo
var contactoEjemplo = new contacto(
    {
        nombre: 'Miguel',
        apellidos: 'Cervantes Saavedra',
        telefono: '666666666',
        grupo: ["Escritores"]
    }
);
// Conexión con la BD
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/contactos');

// Insertamos un documento en la BD
 contactoEjemplo.save(function(error){
   if (error) {
       console.log("Error al intentar grabar contactoEjemplo");
       console.log(error);
   } else {
       contactoEjemplo.save();
       console.log("contactoEjemplo grabado correctamente");
   }
});

// Ejemplo de búsqueda de datos con el modelo
contacto.find({telefono: '666666666'}, function(error, resultado){
    if (error){
        console.log("Error al buscar contacto con el numero 666 66 66 66");
        console.error(error);
    } else {
        console.dir(resultado);
    }
});

// Y finalmente lo borramos
contacto.findOne({telefono: '666666666'}, function(error,datos){
    if(error){
        console.log("Error al buscar el registro para borrarlo");

    } else if (!datos){
        console.log("No se ha encontrado ningún registro con ese número");

    } else {
        datos.remove(function(error){
            if (!error){
                datos.remove();
                console.log("Registro borrado");
            } else {
                console.log("Error al intentar eliminar el registro");
                console.log(error);
            }
        });
    }
});


// Request Handlers

//Ejemplo de parametro en path de la URL
app.get('/bienvenido/:nombre',function (request,response) {
    response.send("<html><head></head><body>Bienvenido " + request.params.nombre + "</body></html>");
    }
);

//Ejemplo de parametros en query de la URL
app.get('/hola',function (request,response) {

    var get_params = url.parse(request.url, true).query;
    if (Object.keys(get_params).length == 0) {
        response.end("<html><head></head><body>Hola a todos.</body></body></head></html>");
    }
    else {
        response.send("<html><head></head><body>Hola " + get_params.nombre + "</body></body></head></html>");
    }
});

app.get('/', function(request,response){
    response.send("<html><head></head><body>Front End</body></body></head></html>");
});

app.get('/api/', function(request,response){
    response.send("<html><head></head><body>Servidor API</body></body></head></html>");
});

app.get('/contactos', function(request, response){
        var get_params = url.parse(request.url,true).query;

        if (Object.keys(get_params).length === 0)
        {
            response.setHeader('content-type','application/json');
            response.set('charset','utf-8');
            response.end(JSON.stringify(agenda.listado()));
        }
        else
        {
            var parametros = Object.getOwnPropertyNames(get_params);
            console.log("Parametros: " + parametros);
            var primerParametro = parametros[0];
            console.log("Primer Parametro: " + primerParametro);
            var valorPrimerParametro = get_params[primerParametro];
            console.log("Valor primer parametro: " + valorPrimerParametro);
            response.setHeader('content-type','application/json');
            response.end(JSON.stringify(agenda.buscaCampo(primerParametro,valorPrimerParametro)));

        }
    }
);

app.get('/contactos/:numero', function(request, response) {
    response.setHeader('content-type','application/json');
    response.end(JSON.stringify(agenda.buscaNum(request.params.numero)));
});

app.get('/grupos', function(request, response) {
    console.log ('Grupos');
    response.setHeader('content-type','application/json');
    response.end(JSON.stringify(agenda.listaGrupos()));
});

app.get('/grupos/:nombre', function(request, response) {
    console.log ('Grupos');
    response.setHeader('content-type','application/json');
    response.end(JSON.stringify(agenda.listaMiembrosGrupo(request.params.nombre)));
});

http.createServer(app).listen(3000, function(){
    console.log('Servidor Express operativo en puerto 3000');
});