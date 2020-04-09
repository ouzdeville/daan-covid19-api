'use strict';
module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define('OTP', {
    associatedPhoneNumber: DataTypes.STRING,
    code: DataTypes.STRING
  }, {});
  OTP.associate = function(models) {
    // associations can be defined here
  };
  return OTP;
};