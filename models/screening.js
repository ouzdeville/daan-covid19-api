'use strict';
module.exports = (sequelize, DataTypes) => {
  const Screening = sequelize.define('Screening', {
    
    samplingDate: {
      type:DataTypes.DATEONLY,
      allowNull: true
    },
    screeningDate: {
      type:DataTypes.DATEONLY,
      allowNull: true
    },
    result: {
      type:DataTypes.STRING,
      allowNull: true
    },
    type: {
      type:DataTypes.STRING,
      allowNull: true
    },
    idUser: DataTypes.UUID,
    healthFacility: {
      type:DataTypes.STRING,
      allowNull: true
    },
    source: {
      type:DataTypes.STRING,
      allowNull: true
    },
  }, {});
  Screening.associate = function(models) {
    // associations can be defined here
  };
  return Screening;
};