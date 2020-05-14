'use strict';
module.exports = (sequelize, DataTypes) => {
    const Screening = sequelize.define('Screening', {
        samplingDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        screeningDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        result: {
            type: DataTypes.STRING,
            allowNull: true
        },
        caseType: {
            type: Sequelize.ENUM('CONTACT', 'COMMUNITY', 'IMPORTED'),
            allowNull: true
        },
        healthFacility: {
            type: DataTypes.STRING,
            allowNull: true
        },
        idSelfReporting: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {});

    Screening.associate = function (models) {
        // associations can be defined here
    };

    return Screening;
};