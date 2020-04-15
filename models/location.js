'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    idUser: DataTypes.INTEGER,
    lat: DataTypes.STRING,
    lng: DataTypes.STRING,
    imei:DataTypes.STRING,
    timestamp: DataTypes.DATE,
    computed:{
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {});
  Location.associate = function(models) {
    // associations can be defined here
  };
  return Location;
};