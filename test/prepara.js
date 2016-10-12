var mongoose = require("mongoose");
beforeEach(function (done) {
    function limpiaBasedatos() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function () {
            });
        }
        return done();
    }

    if (mongoose.connection.readystate === 0) {
        mongoose.connect(config.db.test, function (err) {
            if (err) {
                throw err;
            }
            return limpiaBasedatos();
        })
    } else {
        return limpiaBasedatos();
    }
});
afterEach(function (done) {
    mongoose.disconnect();
    return done();
});