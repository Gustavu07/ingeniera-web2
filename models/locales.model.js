module.exports = (sequelize, Sequelize) => {
    const Local = sequelize.define("locales", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false  
        },
        direccion: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        }
    });
    return Local;
};
