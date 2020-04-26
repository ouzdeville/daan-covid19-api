const fs = require('fs');

module.exports = {
    up: (queryInterface, Sequelize) => {
        let dailyReports = require('./../init_data/daily_report.json');

        return queryInterface.bulkInsert('DailyReports', dailyReports, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('DailyReports', null, {});
    }
};
