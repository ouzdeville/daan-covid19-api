'use strict';
module.exports = (sequelize, DataTypes) => {
  const Encounter = sequelize.define('Encounter', {
    tell_token: DataTypes.STRING,
    last_seen: DataTypes.INTEGER,
    tag: DataTypes.STRING,
    organisation: DataTypes.INTEGER
  }, {});
  Encounter.associate = function(models) {
    // associations can be defined here
  };
  return Encounter;
};