'use strict';
module.exports = (sequelize, DataTypes) => {
    const SelfReporting_Symptom = sequelize.define('SelfReporting_Symptom', {
        idSelfReporting: DataTypes.INTEGER,
        idSymptom: DataTypes.INTEGER
    }, {});

    SelfReporting_Symptom.associate = function (models) {
        SelfReporting_Symptom.belongsTo(models.SelfReporting, {
            as: 'SelfReporting',
            onDelete: 'CASCADE',
            foreignKey: 'idSelfReporting'
        });

        SelfReporting_Symptom.belongsTo(models.Symptom, {
            as: 'Symptom',
            onDelete: 'CASCADE',
            foreignKey: 'idSymptom'
        });
    };

    return SelfReporting_Symptom;
};