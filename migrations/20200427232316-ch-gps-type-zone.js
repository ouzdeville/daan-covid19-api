'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Zones', 'longitude', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn('Zones', 'latitude', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface
        .changeColumn('Zones', 'longitude', {
          type: Sequelize.STRING,
          allowNull: false
        }),
      queryInterface
        .changeColumn('Zones', 'latitude', {
          type: Sequelize.STRING,
          allowNull: false
        })
    ]);
  }
};
