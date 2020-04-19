'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Prevalences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idZone: {
        type: Sequelize.UUID
      },
      date: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      numberOfConfirmedCases: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      numberOfSupectedCases: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      numberOfContactsCases: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      numberOfRecoveredCases: {
        allowNull: true,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Prevalences');
  }
};