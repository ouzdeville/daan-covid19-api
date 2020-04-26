'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Zones',
        'idParent',
        {
          type: Sequelize.UUID,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Zones',
        'type',
        {
          type: Sequelize.ENUM('REGION', 'DEPARTEMENT', 'COMMUNE', 'QUARTIER'),
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Zones',
        'longitude',
        {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Zones',
        'latitude',
        {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Zones', 'idParent'),
      queryInterface.removeColumn('Zones', 'type'),
      queryInterface.removeColumn('Zones', 'longitude'),
      queryInterface.removeColumn('Zones', 'latitude'),
    ]);
  }
};
