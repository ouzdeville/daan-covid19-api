'use strict';
module.exports = (sequelize, DataTypes) => {
  const Symptom = sequelize.define('Symptom', {
    title: DataTypes.STRING,
    img: DataTypes.STRING,
    content: DataTypes.STRING
  }, {});
  Symptom.associate = function(models) {
    // associations can be defined here
  };
  return Symptom;
};