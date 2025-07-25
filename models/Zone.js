'use strict';
module.exports = (sequelize, DataTypes) => {
    const Zone = sequelize.define('Zone', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: DataTypes.STRING,
        description: DataTypes.JSON,
        polygon: DataTypes.JSON,
        idParent: DataTypes.UUID,
        type: DataTypes.STRING,
        longitude: DataTypes.FLOAT,
        latitude: DataTypes.FLOAT,
        men: DataTypes.INTEGER,
        women: DataTypes.INTEGER,
        area: DataTypes.FLOAT,
    }, {});

    Zone.associate = function (models) {
        Zone.hasMany(models.Prevalence, {foreignKey: 'idZone'});
    };

    return Zone;
};