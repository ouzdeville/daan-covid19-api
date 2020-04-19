const {DailyReport} = require('./../models');

module.exports = {
    create(req, res) {
        const data = {
            reportDate: req.body.reportDate,
            numberOfTest: req.body.numberOfTest,
            numberOfImportedCases: req.body.numberOfImportedCases,
            numberOfContactCases: req.body.numberOfContactCases,
            numberOfCommunityCases: req.body.numberOfCommunityCases,
            numberOfRecoveredCases: req.body.numberOfRecoveredCases,
            numberOfDeadCases: req.body.numberOfDeadCases,
            numberOfEvacuatedCases: req.body.numberOfEvacuatedCases,
            totalUnderTreatment: req.body.totalUnderTreatment,
            totalRecovered: req.body.totalRecovered,
            totalDeath: req.body.totalDeath,
            totalEvacuation: req.body.totalEvacuation,
            numberOfPositiveCases: req.body.numberOfPositiveCases,
            totalCases: req.body.totalCases
        };

        DailyReport.create(data)
            .then((dailyReport) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    dailyReport,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    getAll(req, res) {
        DailyReport.findAll()
            .then((dailyReports) => {
                res.status(200).send({
                    dailyReports,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    getLast(req, res) {
        const {reportDate} = req.params;
        DailyReport.findAll({
            limit: 1,
            order: [ [ 'reportDate', 'DESC' ]]
        })
            .then((dailyReports) => {
                res.status(200).send({
                    dailyReports,
                });
            })
            .catch((error) => res.status(400).send(error));
    }
};
