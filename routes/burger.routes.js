const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const burgerController = require("../controllers/burger.controller.js");

    router.get("/", burgerController.listBurger);
    router.get("/create", burgerController.createBurger);
    router.post("/create", burgerController.insertBurger);
    router.get("/:id/edit", burgerController.editBurger);
    router.post("/:id/edit", burgerController.updateBurger);
    router.post("/:id/delete", burgerController.deleteBurger);
    router.get("/catalogo", burgerController.catalogoBurger);
    router.get("/:id/burger", requireUser, burgerController.uploadProfileGet);
    router.post("/:id/burger", requireUser, burgerController.uploadProfilePost);
    router.get('/:id', requireUser, burgerController.mostrarDetallesHamburguesa); // Ruta para mostrar los detalles

    app.use('/burgers', router);
};
