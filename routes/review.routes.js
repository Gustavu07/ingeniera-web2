module.exports = app => {
    const router = require('express').Router();
    const reviewController = require('../controllers/reviewController.js');

    // Ruta para agregar una reseña a una hamburguesa
    router.post('/:hamburguesaId/review', reviewController.agregarReview);

    
    router.get('/hamburguesa/:hamburguesaId', reviewController.obtenerReviews);


    router.post('/editar/:id', reviewController.editarReview);

   
    router.post('/eliminar/:id', reviewController.eliminarReview);


router.get('/:hamburguesaId/create', reviewController.mostrarFormularioReview);

    app.use('/reviews', router);
};
