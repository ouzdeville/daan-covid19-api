'use strict';
module.exports = (sequelize, DataTypes) => {
    const Symptom = sequelize.define('Symptom', {
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        major: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {});

    Symptom.associate = function (models) {
        Symptom.belongsToMany(models.SelfReporting,
            {
                through: models.SelfReporting_Symptom,
                as: 'SelfReporting',
                foreignKey: 'idSymptom',
                otherKey: 'idSelfReporting'
            });
    };

    return Symptom;
};