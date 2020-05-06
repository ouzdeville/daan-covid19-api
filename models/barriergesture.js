'use strict';
module.exports = (sequelize, DataTypes) => {
    const BarrierGesture = sequelize.define('BarrierGesture', {
        title: DataTypes.STRING,
        img: DataTypes.STRING,
        content: DataTypes.TEXT
    }, {});

    BarrierGesture.associate = function (models) {
        // associations can be defined here
    };

    return BarrierGesture;
};