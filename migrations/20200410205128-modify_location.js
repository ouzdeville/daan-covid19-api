'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return Promise.all([
    queryInterface.addColumn(
      'Locations', // table name
      'computed', // new field name
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    ),
    queryInterface.addColumn(
      'Users', // table name
      'debutincubation', // new field name
      {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'Locations', // table name
      'imei', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'Locations', // table name
      'timestamp', // new field name
      {
        type: Sequelize.DATE,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'Users', // table name
      'finincubation', // new field name
      {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
    ),
    
  ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return Promise.all([
    queryInterface.removeColumn('Locations', 'computed'),
    queryInterface.removeColumn('Users', 'debutincubation'),
    queryInterface.removeColumn('Users', 'finincubation'),
    queryInterface.removeColumn('Locations', 'imei'),
    queryInterface.removeColumn('Locations', 'timestamp'),
  ]);
  }
};
