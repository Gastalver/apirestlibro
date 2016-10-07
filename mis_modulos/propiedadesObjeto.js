/**
 * Created by Miguel on 5/10/16.
 */

exports.mostrarPropiedades = function (objeto) {
    var resultado = {};
    for (var i in objeto) {
        if (objeto.hasOwnProperty(i)) {
            resultado[i]=objeto[i] ;
        }
    }
    return resultado;
};