'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExitZone = sequelize.define('ExitZone', {
    idGeofence: DataTypes.INTEGER,
    current_date: DataTypes.DATE,
    position: DataTypes.JSON,
    notif: DataTypes.BOOLEAN
  }, {});
  ExitZone.associate = function(models) {
    ExitZone.belongsTo(models.Geofence, {foreignKey: 'idGeofence'});
  };
  return ExitZone;
};