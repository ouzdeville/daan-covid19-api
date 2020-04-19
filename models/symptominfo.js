'use strict';
module.exports = (sequelize, DataTypes) => {
  const SymptomInfo = sequelize.define('SymptomInfo', {
    title: DataTypes.STRING,
    img: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {});
  SymptomInfo.associate = function(models) {
    // associations can be defined here
  };
  return SymptomInfo;
};