'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Contacts', {
      id:{
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
      },
      contactStartingAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      contactDuration: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      contactDistance: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      lat: {
        allowNull: true,
        type: Sequelize.STRING
      },
      lng: {
        allowNull: true,
        type: Sequelize.STRING
      },
      idUser1: {
        allowNull: true,
        type: Sequelize.UUID
      },
      idUser2: {
        allowNull: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Contacts');
  }
};