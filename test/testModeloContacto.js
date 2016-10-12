var mongoose = require("mongoose");
var should = require("should");
var prepara = require("./prepara");

mongoose.connect("mongodb://localhost/test-contactos", function (error) {
    if (error)
        console.log("Error al conectar a la BD: " + error);
    else
        console.log("Conexión realizada correctamente");
});

var contactoSchema = new mongoose.Schema({
    nombre: String,
    apellidos: String,
    telefono: {type: String, index: {unique: true}},
    grupo: [String]
});

var Contacto = mongoose.model("Contacto", contactoSchema);

describe("Modelo: Contacto", function () {

    describe("#create()", function () {
        it("Debe crear un nuevo contacto", function (done) {
            var contactoEjemplo = {
                nombre: 'William',
                apellidos: 'Shakespeare',
                telefono: '333333333',
                grupo: ["Escritores"]
            };
            Contacto.create(contactoEjemplo, function (err, modeloCreado) {
                //Comprobar que no hay errores
                should.not.exist(err);
                // Comprobar que el documento creado es como se esperaba
                modeloCreado.nombre.should.equal("William");
                modeloCreado.apellidos.should.equal("Shakespeare");
                modeloCreado.telefono.should.equal("333333333");
                modeloCreado.grupo[0].should.equal("Escritores");
                done();
            });
        });
    });
});





