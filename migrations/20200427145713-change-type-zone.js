'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface
   .changeColumn('Zones', 'type', {
     type: Sequelize.STRING,
     allowNull: false
   });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface
    .changeColumn('Zones', 'type', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
