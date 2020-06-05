'use strict';
module.exports = (sequelize, DataTypes) => {
  const Geofence = sequelize.define('Geofence', {
    idUser: DataTypes.UUID,
    poly: DataTypes.JSON,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    lasttime:DataTypes.DATE,
    description:DataTypes.TEXT
  }, {});
  Geofence.associate = function(models) {
    Geofence.belongsTo(models.User, {foreignKey: 'idUser'});
    
    Geofence.hasMany(models.ExitZone, {foreignKey: 'idGeofence'});
  };
  return Geofence;
};