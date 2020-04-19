const {DailyReport} = require('./../models');

module.exports = {
    async create(req, res) {
        reportDate = req.body.reportDate;
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

        // check if the report for the date (reportDate) already exist
        const dailyReport = await DailyReport.findOne({ where: { reportDate: reportDate } });

        if (dailyReport === null) {
            // if it doesn't exist we create it
            DailyReport.create(data)
                .then((dailyReport) => {
                    res.status(201).send({
                        success: true,
                        message: 'Successfully created.',
                        dailyReport,
                    });
                })
                .catch((error) => res.status(400).send(error));
        } else {
            // if it exist we just update it
            DailyReport.update(
                data,
                { where: { reportDate: reportDate } }
            )
                .then((dailyReport) => {
                    res.status(201).send({
                        success: true,
                        message: 'Successfully updated.',
                    });
                })
                .catch((error) => res.status(400).send(error));
        }
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
