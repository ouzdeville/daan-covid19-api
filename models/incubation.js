'use strict';
module.exports = (sequelize, DataTypes) => {
  const Incubation = sequelize.define('Incubation', {
    
    incubationStartedAt: {
      type:DataTypes.DATEONLY,
      allowNull: true
    },
    incubationEndedAt: {
      type:DataTypes.DATEONLY,
      allowNull: true
    },
    idUser: DataTypes.UUID
  }, {});
  Incubation.associate = function(models) {
    // associations can be defined here
    Incubation.belongsTo(models.User, { as: 'User', onDelete: 'CASCADE', foreignKey: 'idUser'});
  };
  return Incubation;
};