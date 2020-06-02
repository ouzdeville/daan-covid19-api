'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
          'Users',
          'OneSignalPlayerId',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'OneSignalPlayerId'),
    ]);
  }
};
