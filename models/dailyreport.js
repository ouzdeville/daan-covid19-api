'use strict';
module.exports = (sequelize, DataTypes) => {
  const DailyReport = sequelize.define('DailyReport', {
    reportDate: {
      type:DataTypes.DATEONLY,
      allowNull: true
    },
    numberOfTest: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    numberOfImportedCases: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    numberOfContactCases: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    numberOfCommunityCases: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    numberOfRecoveredCases: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    numberOfDeadCases: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    numberOfEvacuatedCases: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    totalUnderTreatment: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    totalRecovered: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    totalDeath: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    totalEvacuation: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    numberOfPositiveCases: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    totalCases: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    dailyStatement: {
      type:DataTypes.STRING,
      allowNull: true
    },
  }, {});
  DailyReport.associate = function(models) {
    // associations can be defined here
  };

  return DailyReport;
};