'use strict';
module.exports = (sequelize, DataTypes) => {
  const RiskFactor = sequelize.define('RiskFactor', {
   
    name: {
      type:DataTypes.STRING,
      allowNull: true
    },
    description: {
      type:DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type:DataTypes.STRING,
      allowNull: true
    },
  }, {});
  RiskFactor.associate = function(models) {
    // associations can be defined here
    RiskFactor.belongsToMany(models.SelfReporting, 
      { through: models.SelfReporting_RiskFactor, as: 'SelfReporting',
       foreignKey: 'idSelfReporting' });

  };
  return RiskFactor;
};