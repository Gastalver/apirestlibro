/**
 * Created by Miguel on 5/10/16.
 */

exports.mostrarPropiedades = function (objeto, nombreObjeto) {
    var resultado = "";
    for (var i in objeto) {
        if (objeto.hasOwnProperty(i)) {
            resultado += nombreObjeto + "." + i + " = " + objeto[i] + "\n";
        }
    }
    return resultado;
};