'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
          'BackOfficeUsers',
          'createdById',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('BackOfficeUsers', 'createdById'),
    ]);
  }
};
