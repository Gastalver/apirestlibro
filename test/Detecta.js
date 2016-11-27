/**
 * Created by Miguel on 27/11/2016.
 */


var Objeto = new Object();
Objeto.propiedadUno = "Cadena de texto uno";
Objeto.propiedadDOs = "Cadena de texto dos";
Objeto.propiedadTres= "Cadena de texto tres";
Objeto.propiedadCuatro = {nombre: "Miguel", apellido: "Gastalver"};
Objeto.page = "4";
Objeto.limit ="10";

function purga (q){
    var qP = new Object();
    qP = q;
    if ((Object.keys(qP).indexOf('page')) !== -1)
        delete qP.page;
    if ((Object.keys(qP).indexOf('limit')) !== -1)
    delete qP.limit;
    return qP;
}

console.log(Object.keys(purga(Objeto)));