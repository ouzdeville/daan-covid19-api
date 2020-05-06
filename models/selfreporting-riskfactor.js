'use strict';
module.exports = (sequelize, DataTypes) => {
    const SelfReporting_RiskFactor = sequelize.define('SelfReporting_RiskFactor', {
        idSelfReporting: DataTypes.INTEGER,
        idRiskFactor: DataTypes.INTEGER
    }, {});

    SelfReporting_RiskFactor.associate = function (models) {
        // associations can be defined here
        SelfReporting_RiskFactor.belongsTo(models.SelfReporting, {
            as: 'SelfReporting',
            onDelete: 'CASCADE',
            foreignKey: 'idSelfReporting'
        });

        SelfReporting_RiskFactor.belongsTo(models.RiskFactor, {
            as: 'RiskFactor',
            onDelete: 'CASCADE',
            foreignKey: 'idRiskFactor'
        });
    };

    return SelfReporting_RiskFactor;
};