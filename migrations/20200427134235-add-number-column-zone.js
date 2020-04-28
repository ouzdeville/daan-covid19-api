'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Zones',
        'men',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Zones',
        'women',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Zones', 'men'),
      queryInterface.removeColumn('Zones', 'women'),
    ]);
  }
};
