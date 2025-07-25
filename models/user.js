'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            phone: DataTypes.STRING,
            active: DataTypes.STRING,
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            OneSignalPlayerId: DataTypes.STRING,
        },
        {},
    );

    User.associate = function (models) {
        User.belongsToMany(models.User, {through: models.Contact, as: 'Contact1', foreignKey: 'idUser1'});
        User.belongsToMany(models.User, {through: models.Contact, as: 'Contact2', foreignKey: 'idUser2'});
        User.hasMany(models.Incubation, {foreignKey: 'idUser'});
        User.hasMany(models.SelfReporting, {foreignKey: 'idUser'});
        User.hasMany(models.Geofence, {foreignKey: 'idUser'});
    };

    return User;
};