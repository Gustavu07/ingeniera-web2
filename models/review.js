module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("review", {
        comentario: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        puntuacion: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
    
        usuarioId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        hamburguesaId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'burgers', 
                key: 'id'
            }
        }
    });

    return Review;
};
