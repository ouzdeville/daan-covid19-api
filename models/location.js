'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    idUser: DataTypes.UUID,
    lat: DataTypes.STRING,
    lng: DataTypes.STRING,
    timestamp: DataTypes.DATE
  }, {});
  Location.associate = function(models) {
    // associations can be defined here
  };
  return Location;
};