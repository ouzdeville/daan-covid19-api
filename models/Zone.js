'use strict';
module.exports = (sequelize, DataTypes) => {
  const Zone = sequelize.define('Zone', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING,
    description: DataTypes.JSON,
    polygon: DataTypes.JSON,
    idParent: DataTypes.UUID,
    type: DataTypes.STRING,
    longitude: DataTypes.FLOAT,
    latitude: DataTypes.FLOAT,
    men: DataTypes.INTEGER,
    women: DataTypes.INTEGER
  }, {});
  Zone.associate = function(models) {
    // associations can be defined here
    Zone.hasMany(models.Prevalence, {foreignKey: 'idZone'});
  };
  return Zone;
};