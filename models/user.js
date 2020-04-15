'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      phone: DataTypes.STRING,
      active: DataTypes.STRING,
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      debutincubation: {
        type:DataTypes.DATEONLY,
        allowNull: true,
      },
      finincubation: {
        type:DataTypes.DATEONLY,
        allowNull: true,
      }
    },
    {},
  );
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.User, { through: models.Contact, as: 'Contact1', foreignKey: 'idUser1' });
    User.belongsToMany(models.User, { through: models.Contact, as: 'Contact2', foreignKey: 'idUser2' });
  };
  return User;
};