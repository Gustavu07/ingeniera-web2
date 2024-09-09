const db = require("../models");

exports.catalogoBurger = function (req, res) {
    db.burgers.findAll().then(burgers => {
        res.render('burger/catalogo.burger.ejs', { burgers: burgers });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error al mostrar el catálogo de burgers");
    });
};

exports.mostrarDetallesHamburguesa = async (req, res) => {
    const { id } = req.params;

    try {
        const burger = await db.burgers.findByPk(id, {
            include: [{ model: db.locales, as: 'local' }]
        });

        console.log('Datos de la hamburguesa:', burger);  // Agrega esto para depuración

        if (!burger) {
            return res.status(404).render('404.ejs');
        }

        res.render('burger/detalle.burger.ejs', { burger });
    } catch (error) {
        console.error('Error al obtener los detalles de la hamburguesa:', error);
        res.status(500).render('error.ejs');
    }
};



exports.listBurger = function (req, res) {
    db.burgers.findAll().then(burgers => {
        res.render('burger/list.ejs', { burgers: burgers });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error al listar las burgers");
    });
};

exports.createBurger = async function (req, res) {
    try {
        const restaurantes = await db.locales.findAll();
        res.render('burger/form.burger.ejs', { burger: null, errors: null, restaurantes });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener los restaurantes");
    }
};

exports.insertBurger = function (req, res) {
    const { errors, burger } = validateBurgerForm(req);
    if (errors) {
        res.render('burger/form.burger.ejs', { burger: burger, errors: errors });
        return;
    }
    db.burgers.create({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        localId: req.body.localId  // Cambiado de restauranteId a localId
    }).then(() => {
        res.redirect('/burgers');
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error al insertar la burger");
    });
};

exports.editBurger = async function (req, res) {
    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);
    if (!burger) {
        return res.status(404).send('Burger no encontrada');
    }
    try {
        const restaurantes = await db.locales.findAll();
        res.render('burger/form.burger.ejs', { burger: burger, errors: null, restaurantes });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener los restaurantes");
    }
};

exports.updateBurger = async function (req, res) {
    const { errors, burger } = validateBurgerForm(req);
    if (errors) {
        res.render('burger/form.burger.ejs', { burger: burger, errors: errors });
        return;
    }
    const id = req.params.id;
    const existingBurger = await db.burgers.findByPk(id);

    if (!existingBurger) {
        return res.status(404).send('Burger no encontrada');
    }
    existingBurger.nombre = req.body.nombre;
    existingBurger.descripcion = req.body.descripcion;
    existingBurger.precio = req.body.precio;
    existingBurger.localId = req.body.localId;  // Cambiado de restauranteId a localId

    await existingBurger.save();
    res.redirect('/burgers');
};

exports.deleteBurger = async function (req, res) {
    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);

    if (!burger) {
        return res.status(404).send('Burger no encontrada');
    }

    await burger.destroy();
    res.redirect('/burgers');
};

exports.uploadProfileGet = async function (req, res) {
    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);
    res.render('burger/uploadProfile.ejs', { burger: burger, errors: null });
}

exports.uploadProfilePost = async function (req, res) {

    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);
    if (!req.files?.photo) {
        res.render('burger/uploadProfile.ejs', { errors: { message: 'Debe seleccionar una imagen' }, burger });
        return;
    }
    const image = req.files.photo;
    // eslint-disable-next-line no-undef
    const path = __dirname + '/../public/images/burgers/' + burger.id + '.jpg';

    image.mv(path, function (err) {
        if (err) {
            res.render('burger/uploadProfile.ejs', { errors: { message: 'Error al subir la imagen' }, burger });
            console.log(err);
            return;
        }
        res.redirect('/burgers');
    });
}


const validateBurgerForm = function (req) {
    if (!req.body.nombre || !req.body.descripcion || !req.body.precio || isNaN(req.body.precio)) {
        const errors = {
            nombre: !req.body.nombre,
            descripcion: !req.body.descripcion,
            precio: !req.body.precio || isNaN(req.body.precio)  // Verificamos que el precio sea un número
        };
        errors.message = 'Todos los campos son obligatorios';

        const burger = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio
        };
        return { errors, burger };
    }
    return { errors: null, burger: null };
};
