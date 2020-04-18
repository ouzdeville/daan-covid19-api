'use strict';
module.exports = (sequelize, DataTypes) => {
  const GreenNumber = sequelize.define('GreenNumber', {
    title: DataTypes.STRING,
    number: DataTypes.STRING
  }, {});
  GreenNumber.associate = function(models) {
    // associations can be defined here
  };
  return GreenNumber;
};