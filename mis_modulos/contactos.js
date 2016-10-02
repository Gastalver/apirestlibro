/**
 * Created by Miguel on 2/10/16.
 */

var fs = require("fs");

var lee_archivo_json = function(){
    var archivo = "./contactos.json";
    return fs.readFileSync(archivo);  // devuelve un BUFFER, o sea, una serie de bytes
}

exports.listado = function(){
    return JSON.parse(lee_archivo_json());  // devuelve un OBJETO
}

exports.buscaNum = function(numerotlf){
    var todos = JSON.parse(lee_archivo_json());
    var resultado = todos.result
    for (var i=0; i < resultado.length; i++){
        var sujeto = resultado[i];
        if (sujeto.telefono == numerotlf){
            return(sujeto);
        }
    }
    return null;
}

exports.buscaCampo = function(campo,valor){
    var todos = JSON.parse(lee_archivo_json());
    var resultado = todos.result
    for (var i=0; i < resultado.length; i++){
        contact = resultado[i];
        if (contact[campo] == valor){
            return(contact);
        }
    }
    return null;
}

exports.listaGrupos = function(){
    var todos = JSON.parse(lee_archivo_json());
    var resultado = todos.result
    var lista = new Array();

    for (var i=0; i < resultado.length; i++){
        var grupos = resultado[i].grupo;
        for (var index = 0; index < grupos.length;index++){
            if (lista.indexOf(grupos[index])==-1){
                lista.push(grupos[index]);
            }
        }
    }
    return lista;
}

exports.listaMiembrosGrupo = function (grupo) {
    var todos = JSON.parse(lee_archivo_json());
    var resultado = todos.result;
    var miembros = new Array();
    for (var i = 0; i < resultado.length; i++) {
        if (resultado[i].grupo.indexOf(grupo) > -1) {
            miembros.push(resultado[i]);
        }
    }
    return miembros;
};
