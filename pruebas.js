var fs = require("fs");

var lee_archivo_json = function(){
    var archivo = "./contactos.json";
    return fs.readFileSync(archivo);
};

 var listado = function(){
    return JSON.parse(lee_archivo_json());
};

var buscaNum = function(numerotlf){
    var todos = JSON.parse(lee_archivo_json());
    var resultado = todos.result;
    for (var i=0; i < resultado.length; i++){
        var contact = resultado[i];
        if (contact.telefono == numerotlf){
            return(contact);
        }
    }
    return null;
};

var buscaCampo = function(campo,valor){
    var todos = JSON.parse(lee_archivo_json());
    var resultado = todos.result;
    var contact = null;
    for (var i=0; i < resultado.length; i++){
        contact = resultado[i];
        if (contact[campo] == valor){
            return(contact);
        }
    }
    return null;
};

var listagrupos = function(){
    var todos = JSON.parse(lee_archivo_json());
    var resultado = todos.result;
    var lista = [];

    for (var i=0; i < resultado.length; i++){
        var grupos = resultado[i].grupo;
        for (var index = 0; index < grupos.length;index++){
            if (lista.indexOf(grupos[index])==-1){
                lista.push(grupos[index]);
            }
        }
    }
    return lista;
};

var miembrosgrupo = function (grupo) {
    var todos = JSON.parse(lee_archivo_json());
    var resultado = todos.result;
    var miembros = [];
    for (var i = 0; i < resultado.length; i++) {
        if (resultado[i].grupo.indexOf(grupo) > -1) {
            miembros.push(resultado[i]);
        }
    }
    return miembros;

};
 var cosa  = lee_archivo_json();
// console.log(Object.getOwnPropertyNames(cosa).sort());
// console.log(typeof(cosa)); // object (Buffer)
// console.log(cosa); // <Buffer 7b 0d 0a 20 20 22 72 65 73 75 6c 74 22 3a 5b 0d 0a 7b 0d 0a 20 20 22 6e 6f 6d 62 72 65 22 3a 20 22 4d 69 67 75 65 6c 22 2c 0d 0a 20 20 22 61 70 65 6c ... >
 var listado = JSON.parse(cosa);
// console.log(Object.getOwnPropertyNames(listado));
// console.log(typeof(listado)); // object (Objeto Javascript, propiedades sin comillas)
// console.log(listado); // { result:[ { nombre: 'Miguel'...

// console.log(buscaNum(609181541));
console.log(buscaCampo("nombre","Ignacio"));
// console.log(listagrupos());
// console.log(miembrosgrupo("Amigos"));