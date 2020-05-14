'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Screenings', 'idUser'),
            queryInterface.removeColumn('Screenings', 'source'),
            queryInterface.renameColumn(
                'Screenings',
                'type',
                'caseType',
            ),
            queryInterface.addColumn(
                'Screenings',
                'idSelfReporting',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
            )
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Screenings', 'idSelfReporting'),
            queryInterface.renameColumn(
                'Screenings',
                'caseType',
                'type',
            ),
            queryInterface.addColumn(
                'Screenings',
                'source',
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
            ),
            queryInterface.addColumn(
                'Screenings',
                'idUser',
                {
                    type: Sequelize.UUID,
                    allowNull: true,
                },
            )
        ]);
    }
};
