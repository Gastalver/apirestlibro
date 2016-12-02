/**
 * Created by Miguel on 02/12/2016.
 */

exports.borrar = function(modelo, usuario, response){
    console.log("Borrando usuario + " + usuario + ".");
    modelo.findOne({usuario: usuario}, function(error, data){
        if(error){
            console.log("Error: " + error);
            if(response != null){
                response.writeHead(500,{'Content-Type' : 'text/plain'});
                response.end("Internal Server Error");
            }
            return;
        } else {
            if (!data){
             console.log("Usuario " + usuario + " no encontrado.");
                response.writeHead(404,{'Content-Type' : 'text/plain'});
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
            if (response != null){
                response.writeHead(201,{'Content-Type' : 'text/plain'});
                response.end("Borrado");
            }
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
                    response.writeHead(201,{"Content-Type: "Plain/Text});
                    response.send("Usuario actualizado");
                }
                return;
            } else {
                console.log("Error al actualizar datos del usuario " + nombre_usuario + ".");
                response.send("Error al actualizar datos.");
            }
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