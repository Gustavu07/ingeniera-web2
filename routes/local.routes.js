module.exports = app => {
    let router = require("express").Router();
    const restauranteController = require("../controllers/local.controller.js");


    router.get('/crear', restauranteController.mostrarFormularioCrearRestaurante);
    router.post('/crear', restauranteController.crearRestaurante);
    router.get('/admin', restauranteController.obtenerRestaurantes);
    router.get('/detalles/:id', restauranteController.obtenerRestaurante);
    router.get('/editar/:id', restauranteController.mostrarFormularioEditarRestaurante);
    router.post('/editar/:id', restauranteController.editarRestaurante);
    router.post('/eliminar/:id', restauranteController.eliminarRestaurante);
    router.get('/catalogo', restauranteController.mostrarCatalogoRestaurantes);


    app.use('/restaurantes', router);
};
