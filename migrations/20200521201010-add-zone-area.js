'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Zones',
        'area',
        {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Zones', 'area'),
    ]);
  }
};
