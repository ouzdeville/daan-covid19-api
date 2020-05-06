'use strict';
module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('Contact', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        contactStartingAt: DataTypes.DATE,
        contactDuration: DataTypes.INTEGER,
        contactDistance: DataTypes.FLOAT,
        lat: DataTypes.STRING,
        lng: DataTypes.STRING,
        idUser1: DataTypes.UUID,
        idUser2: DataTypes.UUID
    }, {});

    Contact.associate = function (models) {
        Contact.belongsTo(models.User, {as: 'Contact1', onDelete: 'CASCADE', foreignKey: 'idUser1'});
        Contact.belongsTo(models.User, {as: 'Contact2', onDelete: 'CASCADE', foreignKey: 'idUser2'});
    };

    return Contact;
};