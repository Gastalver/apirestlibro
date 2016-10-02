var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var logger = require("morgan");
var url= require("url");
var app = express();

// Middleware
app.use(logger('dev')); // Logs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.listen(3000, function(){
    console.log("Servidor operativo en puerto 3000");
});

//Ejemplo de parametro en path de la URL
app.get('/bienvenido/:nombre',function (request,response) {
    response.send("<html><head></head><body>Bienvenido " + request.params.nombre + "</body></body></head></html>");
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
