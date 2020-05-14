'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
          'Screenings',
          'caseType',
          {
            type: Sequelize.ENUM('CONTACT', 'COMMUNITY', 'IMPORTED')
          }
      ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
          'Screenings',
          'caseType',
          {
            type: Sequelize.STRING
          }
      ),
    ])
  }
};
