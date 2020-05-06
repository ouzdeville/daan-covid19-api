'use strict';
module.exports = (sequelize, DataTypes) => {
    const Prevalence = sequelize.define('Prevalence', {
        idZone: DataTypes.UUID,
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        numberOfConfirmedCases: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        numberOfSupectedCases: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        numberOfContactsCases: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        numberOfRecoveredCases: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {});

    Prevalence.associate = function (models) {
        Prevalence.belongsTo(models.Zone, {foreignKey: 'idZone'});
    };

    return Prevalence;
};