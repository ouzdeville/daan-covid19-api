'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    idUser1: DataTypes.UUID,
    idUser2: DataTypes.UUID,
    debut: DataTypes.DATE,
    duree: DataTypes.INTEGER,
    distance: DataTypes.STRING,
    lat: DataTypes.STRING,
    lng: DataTypes.STRING
  }, {});
  Contact.associate = function(models) {
    // associations can be defined here
    
    Contact.belongsTo(models.User, { as: 'Contact1', onDelete: 'CASCADE', foreignKey: 'idUser1'});
    Contact.belongsTo(models.User, { as: 'Contact2', onDelete: 'CASCADE',foreignKey: 'idUser2' });
  };
  return Contact;
};