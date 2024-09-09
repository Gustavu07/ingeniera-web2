const db = require("../models");




exports.mostrarFormularioReview = async (req, res) => {
    const { hamburguesaId } = req.params;

    try {
        const hamburguesa = await db.burgers.findByPk(hamburguesaId);
        if (!hamburguesa) {
            return res.status(404).send('Hamburguesa no encontrada');
        }

        res.render('review/form.review.ejs', { hamburguesa });
    } catch (error) {
        console.error('Error al obtener la hamburguesa para el formulario de reseña:', error);
        res.status(500).send('Error al mostrar el formulario de reseña.');
    }
};


// Agregar un review a una hamburguesa


exports.agregarReview = async (req, res) => {
    try {
        const usuarioId = req.session.usuarioId;
        const { comentario, puntuacion } = req.body;
        const hamburguesaId = req.body.hamburguesaId;  

        if (!usuarioId) {
            return res.status(401).send('Debes iniciar sesión para dejar una reseña.');
        }

        if (!hamburguesaId || !comentario || !puntuacion) {
            return res.status(400).send('Todos los campos son obligatorios.');
        }

        const reviewExistente = await db.reviews.findOne({
            where: {
                usuarioId,
                hamburguesaId
            }
        });

        if (reviewExistente) {
            return res.status(400).send('Ya has dejado una reseña para esta hamburguesa.');
        }

        await db.reviews.create({
            usuarioId,
            hamburguesaId,
            comentario,
            puntuacion
        });

        res.redirect(`/burgers/${hamburguesaId}/reviews`);
    } catch (error) {
        console.error('Error al agregar la reseña:', error);
        res.status(500).send('Error al agregar la reseña.');
    }
};


// Mostrar todos los reviews de una hamburguesa
exports.obtenerReviews = async (req, res) => {
    const { hamburguesaId } = req.params;

    try {
        const reviews = await db.reviews.findAll({
            where: { hamburguesaId },
            include: ['usuarios']
        });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los reviews.' });
    }
};

exports.editarReview = async (req, res) => {
    const { id } = req.params;
    const { comentario, puntuacion } = req.body;

    try {
        const review = await db.reviews.findByPk(id);

        if (!review) {
            return res.status(404).json({ mensaje: 'Review no encontrado' });
        }

        review.comentario = comentario;
        review.puntuacion = puntuacion;

        await review.save();
        res.redirect(`/burgers/${review.hamburguesaId}/reviews`);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al editar el review.' });
    }
};

exports.eliminarReview = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await db.reviews.findByPk(id);

        if (!review) {
            return res.status(404).json({ mensaje: 'Review no encontrado' });
        }

        await review.destroy();
        res.redirect(`/burgers/${review.hamburguesaId}/reviews`);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el review.' });
    }
};
