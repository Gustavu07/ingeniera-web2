module.exports = (sequelize, Sequelize) => {
    const Burger = sequelize.define("burgers", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false  
        },
        descripcion: {
            type: Sequelize.STRING,
            allowNull: false 
        },
        precio: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false  
        },
        localId: {  
            type: Sequelize.INTEGER,
            references: {
                model: 'locales',  
                key: 'id'
            },
            allowNull: false  
        }
    });
    return Burger;
}