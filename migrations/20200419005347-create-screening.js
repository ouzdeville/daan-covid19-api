'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Screenings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      samplingDate: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      screeningDate: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      result: {
        allowNull: true,
        type: Sequelize.STRING
      },
      type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      idUser: {
        type: Sequelize.UUID
      },
      healthFacility: {
        allowNull: true,
        type: Sequelize.STRING
      },
      source: {
        allowNull: true,
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Screenings');
  }
};