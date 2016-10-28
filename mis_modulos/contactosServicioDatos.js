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
    modelo.findOne({numTelefono}, function (error, contactoEncontrado) {
        if (error) {
            console.log(error);
            if (response != null) {
                response.writeHead("500", {'Content-Type': 'text/plain'});
                response.end("Internal Server Error");
            }

        } else {
            var contacto = pasaRequestBodyaInstanciadeContacto(requestBody, modelo);
            if (!contactoEncontrado) {
                console.log("No existe ningún contacto con el teléfono " + numTelefono + ". Se creará uno nuevo.");
                contacto.save(function (error) {
                    if (!error) {
                        contacto.save();
                    }
                    if (response != null) {
                        response.writeHead("201", {'Content-Type': 'text/plain'});
                        response.end("Contacto creado");
                    }

                });
            }
            // Actualizar valores
            contactoEncontrado.nombre = contacto.nombre;
            contactoEncontrado.apellidos = contacto.apellidos;
            contactoEncontrado.grupo = contacto.grupo;
            contactoEncontrado.telefono = contacto.telefono;
            // Grabar nuevos valores
            contactoEncontrado.save(function (error) {
                if (!error) {
                    console.log("Actualizado correctamente contacto con número de teléfono: " + numTelefono);
                    contactoEncontrado.save();
                } else {
                    console.log("Error al intentar actualizar datos del contacto");
                }
            });
            if (response != null) {
                response.send("Contacto actualizado con éxito");
            }
        }
    });
};

exports.crea = function (modelo, requestBody, response) {
    var nuevoContacto = pasaRequestBodyaInstanciadeContacto(requestBody, modelo);
    var numTelefono = requestBody.telefono;
    console.log("numTelefono: " + numTelefono);
    nuevoContacto.save(function (error) {
        if (!error) {
            nuevoContacto.save();
        } else {
            // Vamos a comprobar si ya existe un contacto con ese número, que es índice único.
            console.log("Comprobando si existe ya un contacto con el teléfono " + numTelefono);
            modelo.findOne({telefono: numTelefono}, function (error, contactoEncontrado) {
                if (error) {
                    console.log(error);
                    if (response != null) {
                        response.writeHead("500", {'Content-Type': 'text/plain'});
                        response.end("Internal Server Error");
                    }

                } else {
                    var nuevoContacto = pasaRequestBodyaInstanciadeContacto(requestBody, modelo);
                    if (!contactoEncontrado) {
                        console.log("No hay un contacto con ese número. Será creado.");
                        nuevoContacto.save(function (error) {
                                if (!error) {
                                    nuevoContacto.save();
                                } else {
                                    console.log(error);
                                }
                                if (response != null) {
                                    response.writeHead("201", {'Content-Type': 'text/plain'});
                                    response.end("Contacto creado.");
                                }

                            }
                        );
                    } else {
                        // Si ya existía el contacto lo actualizamos.
                        console.log("Existía un contacto con ese número. Actualizando datos");
                        contactoEncontrado.nombre = nuevoContacto.nombre;
                        contactoEncontrado.apellidos = nuevoContacto.apellidos;
                        contactoEncontrado.telefono = nuevoContacto.telefono;
                        contactoEncontrado.grupo = nuevoContacto.grupo;
                        contactoEncontrado.save(function (error) {
                            if (!error) {
                                contactoEncontrado.save();
                                console.log("Actualizados los datos del contacto con número de teléfono " + numTelefono);
                                response.send("Actualizados los datos del contacto con número de teléfono " + numTelefono);
                            } else {
                                console.log("Error al intentar actualizar los datos del contacto con número de teléfono: " + numTelefono);
                                console.log(error);
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
            grupo: body.grupo,
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
        return JSON.stringify(listadeContactos);
    });
};

exports.buscaCampo = function (modelo, campo, valor, response) { // TODO Corregir buscaCampo

    modelo.find({campo: valor}, function (error, listadeContactos) {
        if (error) {
            console.error(error);
            return null;
        }
        if (response != null) {
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify(listadeContactos));
        }
        return JSON.stringify(listadeContactos);
    });

};