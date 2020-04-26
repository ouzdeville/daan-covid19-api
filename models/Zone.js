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
    type: DataTypes.ENUM('REGION', 'DEPARTEMENT', 'COMMUNE', 'QUARTIER'),
    longitude: DataTypes.FLOAT,
    latitude: DataTypes.FLOAT
  }, {});
  Zone.associate = function(models) {
    // associations can be defined here
  };
  return Zone;
};