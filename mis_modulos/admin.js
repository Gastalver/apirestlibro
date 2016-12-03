/* Modulo para administrar usuarios */

exports.borrar = function(modelo, usuario, response){
    console.log("Borrando usuario + " + usuario + ".");
    modelo.findOne({usuario: usuario}, function(error, data){
        if (error) {
            console.log("Error: " + error);
            if (response != null) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.end("Internal Server Error");
            }
            return;
        } else if (!data) {
            console.log("Usuario " + usuario + " no encontrado.");
            if (response != null) {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end("Not found");
            }
            return;
        } else {
            data.remove(function(error){
                if(!error){
                    data.remove();
                } else {
                    console.log(error);
                }
            });
            console.log("Usuario " + usuario + " eliminado");
            response.end("Borrado");

        }

    });
}

exports.actualizar = function(modelo, requestBody, response){
    var nombre_usuario = requestBody.usuario;
    modelo.findOne({usuario: nombre_usuario}, function (error,data){
        if(error){
            console.log("Error: " + error);
            if(response != null){
                response.writeHead(500,{'Content-Type' : 'text/plain'});
                response.end("Internal Server Error");
            }
            return;
        }
        else {
        var nuevoUsuario = pasaBodyRequestAnuevaInstanciaModeloUsuario(requestBody, usuarioAutorizado);
        if (!data){
                console.log("Usuario " + nombre_usuario + " no encontrado.");
                nuevoUsuario.save(function(error){
                    if(!error) {
                        nuevoUsuario.save();
                        console.log("Se ha creado el usuario " + nombre_usuario);
                        if(response != null){
                            response.writeHead(201,{'Content-Type' : 'text/plain'});
                            response.end("Usuario creado.");
                        }
                    }
                });
                return;
            }
        }
        data.usuario = nuevoUsuario.usuario;
        data.clave = nuevoUsuario.clave;
        data.rol = nuevoUsuario.rol;
        data.save(function(error){
            if(!error){
                console.log("Usuario " + nombre_usuario + " actualizado.");
                if(response!=null){
                    response.writeHead(201,{"Content-Type": "Text/plain"});
                    response.send("Usuario actualizado.");
                }
                return;
            } else {
                console.log("Error al actualizar datos del usuario " + nombre_usuario + ".");
                response.send("Error al actualizar datos.");
            }
        });
    });



}


exports.crear = function(modelo, requestBody, response){
    var nombre_usuario = requestBody.usuario;
    console.log("Se me pide crear el usuario: " + nombre_usuario);
    var nuevoUsuario = pasaBodyRequestAnuevaInstanciaModeloUsuario(requestBody, modelo);
    nuevoUsuario.save(function(error){
        if(!error){
            console.log("Nuevo usuario " + nombre_usuario + " creado.");
            response.end("Usuario creado.");

        } else
            {
            // Comprobamos que el usuario no existe ya.
            console.log("Falló creación. Comprobando si ha sido debido a que el usuario ya existía");
            modelo.findOne({usuario: nombre_usuario},function(error, data){
                if (error){
                    console.log("Error: " + error);
                    if(response != null){
                        response.writeHead(500,{'Content-Type' : 'Text/plain'});
                        response.end("Internal Server Error");
                    }
                    return;
                } else {
                    // Repetimos creacion de instancia del modelo
                    var nuevoUsuario = pasaBodyRequestAnuevaInstanciaModeloUsuario(requestBody, modelo);
                    if (!data){
                        console.log("El usuario "+ nombre_usuario +" no existía. Se crea de nuevo.");
                        nuevoUsuario.save(function(error){
                            if(!error){
                                nuevoUsuario.save();
                                if (response |= null){
                                    response.writeHead(200,{"Content-Type" : "Text/plain"});
                                    response.send("Usuario creado.")
                                }
                            } else {
                                console.log(error);
                            }
                        });
                        return;
                    } else{
                        console.log("Actualizando usuario " + nombre_usuario);
                        data.usuario = nuevoUsuario.usuario;
                        data.clave = nuevoUsuario.clave;
                        data.rol = nuevoUsuario.rol;
                        data.save(function(error){
                            if(!error){
                                console.log("Usuario " + nombre_usuario + " actualizado.");
                                response.end("Usuario actualizado.");
                            } else {
                                console.log("Error al actualizar usuario " + nombre_usuario + ": " + error);
                                if(response != null){
                                    response.writeHead(500,{'Content-Type' : 'text/plain'});
                                    response.end("Internal Server Error");
                                }
                            }
                        });
                    }
                }
            });
        }
    });
}

exports.listado = function(modelo, request, response){

    modelo.paginate({}, {page: request.query.page, limit: request.query.limit},
        function (error, resultados, pageCount, itemCount) {
            if (error) {
                console.error(error);
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.end('Internal server error');
                return;
            }

            response.json({
                object: 'Usuarios',
                // has_more: expressPaginate.hasNextPages(req)(pageCount),
                requestQueryPage: request.query.page,
                requestQueryLimit: request.query.limit,
                data: resultados.docs,
            });


        });
}

function pasaBodyRequestAnuevaInstanciaModeloUsuario(body, usuarioAutorizado) {
    return new usuarioAutorizado(
        {
            usuario: body.usuario,
            clave: body.clave,
            rol: body.rol,
        }
    );
}
