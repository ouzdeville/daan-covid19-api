'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      phone: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {},
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};