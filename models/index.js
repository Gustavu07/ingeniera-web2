const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);

//quiero agregar una nueva tabla misma logica
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.burgers = require("./burger.model.js")(sequelize, Sequelize);
db.reviews = require("./review.js")(sequelize, Sequelize);
db.locales = require("./locales.model.js")(sequelize, Sequelize);
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);

// Relación Restaurante - Hamburguesa (Un restaurante puede tener muchas hamburguesas)
db.locales.hasMany(db.burgers, {
    foreignKey: 'localId',
    as: 'burgers'
});
db.burgers.belongsTo(db.locales, {
    foreignKey: 'localId',
    as: 'local'
});

// Relación Usuario - Review (Un usuario puede tener muchas reviews)
db.usuarios.hasMany(db.reviews, {
    foreignKey: 'usuarioId',
    as: 'reviews'
});
db.reviews.belongsTo(db.usuarios, {
    foreignKey: 'usuarioId',
    as: 'usuario'
});

// Relación Hamburguesa - Review (Una hamburguesa puede tener muchas reviews)
db.burgers.hasMany(db.reviews, {
    foreignKey: 'hamburguesaId',
    as: 'reviews'
});
db.reviews.belongsTo(db.burgers, {
    foreignKey: 'hamburguesaId',
    as: 'burger'
});




module.exports = db;
