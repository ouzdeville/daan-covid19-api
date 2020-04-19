'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DailyReports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reportDate: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      numberOfTest: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      numberOfImportedCases: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      numberOfContactCases: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      numberOfCommunityCases: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      numberOfRecoveredCases: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      numberOfDeadCases: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      numberOfEvacuatedCases: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      totalUnderTreatment: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      totalRecovered: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      totalDeath: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      totalEvacuation: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      numberOfPositiveCases: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      totalCases: {
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
    return queryInterface.dropTable('DailyReports');
  }
};