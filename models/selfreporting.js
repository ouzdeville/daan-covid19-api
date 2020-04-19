'use strict';
module.exports = (sequelize, DataTypes) => {
  const SelfReporting = sequelize.define('SelfReporting', {
    reportingDate: DataTypes.DATE,
    idUser: DataTypes.UUID,
    lat: {
      type:DataTypes.STRING,
      allowNull: true
    },
    lng: {
      type:DataTypes.STRING,
      allowNull: true
    },
    firstname: {
      type:DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type:DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type:DataTypes.STRING,
      allowNull: true
    },
    dateOfBirth: {
      type:DataTypes.DATEONLY,
      allowNull: true
    },
    age: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    email: {
      type:DataTypes.STRING,
      allowNull: true
    },
    adresse: {
      type:DataTypes.TEXT,
      allowNull: true
    },
    department: {
      type:DataTypes.STRING,
      allowNull: true
    },
    region: {
      type:DataTypes.STRING,
      allowNull: true
    },
  }, {});
  SelfReporting.associate = function(models) {
    // associations can be defined here
    SelfReporting.belongsToMany(models.Symptom, 
      { through: models.SelfReporting_Symptom, as: 'Symptom',
       foreignKey: 'idSymptom' });

    SelfReporting.belongsToMany(models.RiskFactor, 
    { through: models.SelfReporting_RiskFactor, as: 'RiskFactor',
      foreignKey: 'idRiskFactor' });

  };
  return SelfReporting;
};