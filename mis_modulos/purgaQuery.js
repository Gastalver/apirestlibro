/* Modulo que toma el objeto producido por url.parse(req.url,true).query
   y devuelve un objeto queryPurgado idéntico salvo porque no tiene las propiedades limit, ni page
   para poder usarlo directamente como parámetro query en el método .paginate() que añade al modelo de
   Mongoose el plugin mongoose-paginate y obtener así resultados de búsqueda paginados.
 */

exports.purga = function (q){
    var qP = new Object();
    for (var p in q){
        if (Object.prototype.hasOwnProperty.call(q,p) && q.p!=='page'){ // TODO: Comprobar condicional. No filtra.
            qP[p]=q.p;
        }
    }
    return qP;
}