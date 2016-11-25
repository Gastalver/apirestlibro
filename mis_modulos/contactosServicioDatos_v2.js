/* Operaciones CRUD para el modelo Contacto.
 * Creates, Removes, Updates or Deletes a Document based on Contacto Model.
 * */

exports.elimina = function (modelo, numTelefono, response) {
    console.log("Borrando el contacto con número de teléfono: " + numTelefono);

    modelo.findOne({telefono: numTelefono}, function (error, contactoEncontrado) {
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
};

exports.actualiza = function (modelo, requestBody, response) {
    var numTelefono = requestBody.telefono;
    // Buscamos el documento a actualizar, por el número de teléfono
    modelo.findOne({telefono: numTelefono}, function (error, contactoEncontrado) {
        // Si se produce un error al buscar el documento con ese tlf, informa y regresa.
        if (error) {
            console.log("Error buscando un contacto con el telefono " + numTelefono + " :" + error);
            if (response != null) {
                response.writeHead("500", {'Content-Type': 'text/plain'});
                response.end("Internal Server Error");
            }
        }
        // Si no hay errores al buscar el documento, veamos.
        else {
            // Si no se ha encontrado el documento con ese tlf, volvemos cargar el body en el modelo y grabamos uno nuevo.
            var nuevoContacto = pasaRequestBodyaInstanciadeContacto(requestBody, modelo);
            if (!contactoEncontrado) {
                console.log("No hay un contacto con ese número. Será creado.");
                // Graba nuevo. Me pregunto por qué no lo hizo a la primera.
                nuevoContacto.save(function (error) {
                    // Si no hay errores, vuelve a grabar (?) informa y regresa.
                    if (!error) {
                        nuevoContacto.save();
                        console.log("Creado nuevo contacto con numero de teléfono " + numTelefono);
                        if (response != null) {
                            response.writeHead("201", {'Content-Type': 'text/plain'});
                            response.end("Contacto nuevo creado.");
                        }
                    }
                    // Si hay errores al intentar grabar, informa y regresa.
                    else {
                        console.log("Error al intentar crear un nuevo contacto con el telefono " + numTelefono + " :" + error);
                        if (response != null) {
                            response.writeHead("500", {'Content-Type': 'text/plain'});
                            response.end("Internal Server Error");
                        }
                    }
                });
            }
            // Si se encuentra registro con ese tlf, lo actualizamos.
            else {
                console.log("Existía un contacto con ese número. Actualizando datos");
                contactoEncontrado.nombre = nuevoContacto.nombre;
                contactoEncontrado.apellidos = nuevoContacto.apellidos;
                contactoEncontrado.telefono = nuevoContacto.telefono;
                contactoEncontrado.grupo = nuevoContacto.grupo;
                contactoEncontrado.save(function (error) {
                    // Si la actualización se culmina sin errores, vuelve a grabar (?) e informa.
                    if (!error) {
                        contactoEncontrado.save();
                        console.log("Actualizados los datos del contacto con número de teléfono " + numTelefono);
                        if (response != null) {
                            response.writeHead("201", {'Content-Type': 'text/plain'});
                            response.end("Actualizados los datos del contacto con número de teléfono " + numTelefono);
                        }
                    }
                    // Si en la actualización se producen errores, informa Error 500 y termina.
                    else {
                        console.log("Error al intentar actualizar los datos del contacto con número de teléfono: " + numTelefono);
                        console.log(error);
                        if (response != null) {
                            response.writeHead("500", {'Content-Type': 'text/plain'});
                            response.end("Internal Server Error");
                        }
                    }
                });
            }
        }
    });
};

// Para crear registros via HTTP indicar el Content-Type: application/json en la cabecera, y mandar un objeto JSON en el cuerpo.
exports.crea = function (modelo, requestBody, response) {
    var nuevoContacto = pasaRequestBodyaInstanciadeContacto(requestBody, modelo);
    var numTelefono = requestBody.telefono;
    console.log("numTelefono: " + numTelefono);
    // Graba desde el modelo
    nuevoContacto.save(function (error) {
        // Si no hay errores al grabar por primera vez, vuelve a grabar y regresa (Me expliquen la duplicidad por favor).
        if (!error) {
            nuevoContacto.save();
            console.log("Creado a la primera");
            if (response != null) {
                response.writeHead("201", {'Content-Type': 'text/plain'});
                response.end("Contacto creado a la primera.");
            }
        }
        // Si hay errores al grabar por primera vez:
        else {
            // Vamos a comprobar si ya existe un contacto con ese número, que es índice único.
            console.log("Comprobando si existe ya un contacto con el teléfono " + numTelefono);
            modelo.findOne({telefono: numTelefono}, function (error, contactoEncontrado) {
                // Si se produce un error al buscar registro con ese tlf, informa y regresa. Ya esta bien, hombre.
                if (error) {
                    console.log("Error comprobando si existe un contecto con el telefono " + numTelefono + " :" + error);
                    if (response != null) {
                        response.writeHead("500", {'Content-Type': 'text/plain'});
                        response.end("Internal Server Error");
                    }
                }
                // Si no hay errores al buscar el registro, veamos.
                else {
                    // Si no se encuentra registro con ese tlf, volvemos a cargar el body en el modelo y a grabarlo.
                    var nuevoContacto = pasaRequestBodyaInstanciadeContacto(requestBody, modelo);
                    if (!contactoEncontrado) {
                        console.log("No hay un contacto con ese número. Será creado.");
                        // Graba. Segundo intento. Me pregunto por qué no lo hizo a la primera.
                        nuevoContacto.save(function (error) {
                            // Si no hay errores a la segunda, vuelve a grabar (?) informa y regresa.
                            if (!error) {
                                nuevoContacto.save();
                                console.log("Creado a la segunda");
                                if (response != null) {
                                    response.writeHead("201", {'Content-Type': 'text/plain'});
                                    response.end("Contacto creado a la segunda.");
                                }
                            }
                            // Si hay errores al intentar grabar a la segunda, informa y regresa. Ya está bien de joder.
                            else {
                                console.log("Error al intentar grabar a la segunda un contacto con el telefono " + numTelefono + " :" + error);
                                if (response != null) {
                                    response.writeHead("500", {'Content-Type': 'text/plain'});
                                    response.end("Internal Server Error");
                                }
                            }
                        });
                    }
                    // Si se encuentra registro con ese tlf, lo actualizamos.
                    else {
                        console.log("Existía un contacto con ese número. Actualizando datos");
                        contactoEncontrado.nombre = nuevoContacto.nombre;
                        contactoEncontrado.apellidos = nuevoContacto.apellidos;
                        contactoEncontrado.telefono = nuevoContacto.telefono;
                        contactoEncontrado.grupo = nuevoContacto.grupo;
                        contactoEncontrado.save(function (error) {
                            // Si la actualización se culmina sin errores, vuelve a grabar (?) e informa.
                            if (!error) {
                                contactoEncontrado.save();
                                console.log("Actualizados los datos del contacto con número de teléfono " + numTelefono);
                                if (response != null) {
                                    response.writeHead("201", {'Content-Type': 'text/plain'});
                                    response.end("Actualizados los datos del contacto con número de teléfono " + numTelefono);
                                }
                            }
                            // // Si en la actualización se producen errores, informa Error 500 y termina.
                            else {
                                console.log("Error al intentar actualizar los datos del contacto con número de teléfono: " + numTelefono);
                                console.log(error);
                                if (response != null) {
                                    response.writeHead("500", {'Content-Type': 'text/plain'});
                                    response.end("Internal Server Error");
                                }
                            }
                        });
                    }
                }
            });
        }
    });
};

function pasaRequestBodyaInstanciadeContacto(body, Contacto) {
    return new Contacto(
        {
            nombre: body.nombre,
            apellidos: body.apellidos,
            telefono: body.telefono,
            grupo: body.grupo
        }
    );
}
exports.encuentraPorNumero = function (modelo, numTelefono, response) {
    modelo.findOne({telefono: numTelefono}, function (error, contactoEncontrado) {

        if (error) {
            console.log("Error buscando el contacto con número de telefono: " + numTelefono);
            console.log(error);
            if (response != null) {
                response.writeHead("500", {'Content-Type': 'text/plain'});
                response.end("Internal Server Error");
            }

        } else {
            if (!contactoEncontrado) {
                if (response != null) {
                    console.log("No encontrado");
                    response.writeHead("404", {'Content-Type': 'text/plain'});
                    response.end("No encontrado");
                }
                return;
            }
            if (response != null) {
                response.setHeader('Content-Type', 'application/json');
                response.send(contactoEncontrado);
            }
            console.log(contactoEncontrado);
        }
    });
};

exports.listado = function (modelo, response) {
    modelo.find({}, function (error, listadeContactos) {
        if (error) {
            console.error(error);
            return null;
        }
        if (response != null) {
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify(listadeContactos));
        }
        //return JSON.stringify(listadeContactos);
    });
};

exports.buscaCampo = function (Contacto, primerParametro, valorPrimerParametro, response) {

    Contacto.find().where(primerParametro, valorPrimerParametro).exec(function (error, listadeContactos) {
        if (error) {
            console.log("Se ha producido un error al buscar documentos con el valor " + valorPrimerParametro + " en el campo " + primerParametro + ".");
            console.error(error);
            if (response != null) {
                response.writeHead("500", {'Content-Type': 'text/plain'});
                response.end("Internal Server Error");
            }
            return null;
        }
        else {
            //console.log("No se ha producido ningún error al buscar documentos con el valor "+ valorPrimerParametro + " en el campo "+ primerParametro + ".");

            if (response != null) {
                response.setHeader('content-type', 'application/json');
                response.end(JSON.stringify(listadeContactos));
            }
            return JSON.stringify(listadeContactos);
        }
    });

};

// Para subir archivos, hay que indicar en la cabecera del request Content-type image/jpg

exports.actualizaImagen = function (gfs, request, response) { // TODO: Corregir reference error
    var numTelefono = request.params.numTlf;
    console.log('Actualizando imagen de contacto con número de teléfono: ' + numTelefono);
    request.pipe(gfs.createWriteStream({_id: numTelefono, filename: 'image.jpg', mode: 'w'}));
    response.send("Imagen correctamente actualizada del contacto con número de teléfono: " + numTelefono);
};

exports.traeImagen = function (gfs, numTelefono, response) {

    console.log('Pidiendo imagen del contacto con número de teléfono: ' + numTelefono);

    var streamImagen = gfs.createReadStream({
        _id: numTelefono,
        filename: 'image.jpg',
        mode: 'r'
    });

    streamImagen.on('error', function (error) {
        response.status('404').send('Not found');

    });

    response.setHeader('Content-Type', 'image/jpeg');

    streamImagen.pipe(response);
};

exports.borraImagen = function (gfs, mongodb, numTelefono, response) {
    console.log('Borrando la imagen del contacto con número de teléfono:' + numTelefono);
    // gridfs-stream todavía no incluye un método para eliminar binarios, la única manera es
    // eliminar a mano el binario, que mongo guarda en la colección fs.files

    var collection = mongodb.collection('fs.files');
    collection.remove({_id: numTelefono, filename: 'image.jpg'},
        function (error, contact) {
            if (error) {
                console.log(error);
                return;
            }
            if (contact === null) {
                response.send('404', 'Not found');

            }
            else {
                console.log('Borrada correctamente la imagen del contacto con número de teléfono: ' + numTelefono);
            }
        });
    response.send('Borrada correctamente la imagen del contacto con número de teléfono: ' + numTelefono);
};

exports.pagina = function (modelo, request, response) {

    modelo.paginate({}, {page: request.query.page, limit: request.query.limit},
        function (error, resultados, pageCount, itemCount) {
            if (error) {
                console.error(error);
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.end('Internal server error');
                return;
            }

            response.json({
                object: 'Contactos',
                // has_more: expressPaginate.hasNextPages(req)(pageCount),
                requestQueryPage: request.query.page,
                requestQueryLimit: request.query.limit,
                data: resultados.docs,
            });


        });
};