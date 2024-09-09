const db = require("../models");

// Mostrar el formulario de agregar restaurante
exports.mostrarFormularioCrearRestaurante = (req, res) => {
    res.render('local/form.ejs', { errores: null });
};

// Crear un nuevo restaurante
exports.crearRestaurante = async (req, res) => {
    const { nombre, direccion, descripcion } = req.body;

    // Validar que los campos no estén vacíos
    if (!nombre || !direccion || !descripcion) {
        return res.render('local/form.ejs', { errores: { mensaje: 'Todos los campos son obligatorios.' } });
    }

    try {
        // Crear restaurante
        const nuevoRestaurante = await db.locales.create({
            nombre,
            direccion,
            descripcion
        });

        // Redirigir a la lista de restaurantes
        res.redirect('/restaurantes/admin');
    } catch (error) {
        console.error('Error al crear el restaurante:', error);
        res.status(500).render('local/form.ejs', { errores: { mensaje: 'Error al crear el restaurante.' } });
    }
};

// Mostrar todos los restaurantes en el catálogo
exports.mostrarCatalogoRestaurantes = async (req, res) => {
    try {
        const restaurantes = await db.locales.findAll({
            include: ['burgers']  // Incluir las hamburguesas asociadas
        });

        // Renderizar la vista de catálogo de restaurantes
        res.render('local/restaurantes.ejs', { restaurantes });
    } catch (error) {
        console.error('Error al obtener los restaurantes:', error);
        res.status(500).render('catalogo/restaurantes.ejs', { errores: { mensaje: 'Error al obtener los restaurantes' } });
    }
};

// Mostrar un restaurante y sus hamburguesas en el catálogo
exports.verRestauranteEnCatalogo = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurante = await db.locales.findByPk(id, {
            include: ['burgers']  // Incluir las hamburguesas asociadas
        });

        if (!restaurante) {
            return res.status(404).render('local/restaurantes.ejs', { errores: { mensaje: 'Restaurante no encontrado' } });
        }

        // Renderizar la vista de detalles del restaurante y sus hamburguesas
        res.render('burger/catalogo.burger.ejs', { restaurante, hamburguesas: restaurante.hamburguesas });
    } catch (error) {
        console.error('Error al obtener el restaurante:', error);
        res.status(500).render('local/restaurantes.ejs', { errores: { mensaje: 'Error al obtener el restaurante' } });
    }
};

// Obtener todos los restaurantes y mostrarlos en una vista
exports.obtenerRestaurantes = async (req, res) => {
    try {
        const restaurantes = await db.locales.findAll({
            include: ['burgers']  // Relación con las hamburguesas
        });

        // Renderizar la vista de lista de restaurantes
        res.render('local/list.ejs', { restaurantes });
    } catch (error) {
        console.error('Error al obtener los restaurantes:', error);
        res.status(500).render('local/list.ejs', { errores: { mensaje: 'Error al obtener los restaurantes' } });
    }
};

// Mostrar un restaurante específico por su ID
exports.obtenerRestaurante = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurante = await db.locales.findByPk(id, {
            include: ['burgers']  // Relación con las hamburguesas
        });
        if (!restaurante) {
            return res.status(404).render('local/list.ejs', { errores: { mensaje: 'Restaurante no encontrado' } });
        }

        // Renderizar la vista con los detalles del restaurante
        res.render('burger/catalogo.ejs', { restaurante });
    } catch (error) {
        console.error('Error al obtener el restaurante:', error);
        res.status(500).render('local/list.ejs', { errores: { mensaje: 'Error al obtener el restaurante' } });
    }
};

// Mostrar formulario de edición con los datos del restaurante cargados
exports.mostrarFormularioEditarRestaurante = async (req, res) => {
    try {
        const restaurantes = await db.locales.findAll();  // Obtener todos los restaurantes
        const restaurante = await db.locales.findByPk(req.params.id);

        if (!restaurante) {
            return res.status(404).render('local/edit.ejs', { errores: { mensaje: 'Restaurante no encontrado' }, restaurantes });
        }

        // Renderizar la vista del formulario con los datos del restaurante y la lista de todos los restaurantes
        res.render('local/edit.ejs', { restaurante, restaurantes, errores: null });
    } catch (error) {
        console.error('Error al cargar el restaurante:', error);
        res.status(500).render('local/edit.ejs', { errores: { mensaje: 'Error al cargar el restaurante' }, restaurantes: [] });
    }
};

// Editar un restaurante existente
exports.editarRestaurante = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, descripcion } = req.body;

    try {
        const restaurante = await db.locales.findByPk(id);
        if (!restaurante) {
            return res.status(404).render('local/list.ejs', { errores: { mensaje: 'Restaurante no encontrado' }, restaurante });
        }

        
        restaurante.nombre = nombre;
        restaurante.direccion = direccion;
        restaurante.descripcion = descripcion;

        
        await restaurante.save();
        res.redirect('/restaurantes/admin');
    } catch (error) {
        console.error('Error al editar el restaurante:', error);
        res.status(500).render('local/list.ejs', { errores: { mensaje: 'Error al editar el restaurante.' }, restaurante });
    }
};

exports.eliminarRestaurante = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurante = await db.locales.findByPk(id);
        if (!restaurante) {
            return res.status(404).render('local/list.ejs', { errores: { mensaje: 'Restaurante no encontrado' } });
        }

        await restaurante.destroy();

        res.redirect('/restaurantes/admin'); 
    } catch (error) {
        console.error('Error al eliminar el restaurante:', error);
        res.status(500).render('local/list.ejs', { errores: { mensaje: 'Error al eliminar el restaurante' } });
    }
};
