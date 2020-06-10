'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
          'BackOfficeUsers',
          'phone',
          {
            type: Sequelize.STRING
          },
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('BackOfficeUsers', 'phone'),
    ]);
  }
};
