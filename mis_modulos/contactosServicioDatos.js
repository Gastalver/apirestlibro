/* Operaciones CRUD para el modelo Contacto.
 * Creates, Removes, Updates or Deletes a Document based on Contacto Model.
 * */

exports.borra(modelo, numTelefono, response);
{
    console.log("Borrando el contacto con número de teléfono: " + numTelefono);

    model.findOne({telefono: numTelefono}, function (error, contactoEncontrado) {
        if (error) {
            console.log("Error borrando el contacto: " + error);
            if (response != null) {
                response.writeHead("500", {'Content-Type': 'text/plain'});
                response.end("Internal Server Error");
            }
        } else {
            if (!contactoEncontrado) {
                console.log("No se ha encontrado ningún contacto con el número de teléfono: " + numTelefono);
                if (response != null) {
                    response.writeHead(404, {'Content-Type': 'text/plain'});
                    response.end("No se ha encontrado ningún contacto con el número de teléfono: " + numTelefono);
                }

            } else {
                contactoEncontrado.remove(function (error) {
                    if (!error) {
                        contactoEncontrado.remove();
                    } else {
                        console.log("Error al intentar borrar el contacto encontrado con el número de teléfono: " + numTelefono + " : " + error);
                    }
                    if (response != null) {
                        response.send("Borrado");
                    }

                });
            }
        }
    });
}

