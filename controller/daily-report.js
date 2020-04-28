const {DailyReport} = require('./../models');
var fs = require('fs');
var path = require('path');
const request = require("request-promise-native");
module.exports = {
  /**
   * @api {post} /daily-report Add report for a specific day
   * @apiName CreateDailyReport
   * @apiGroup DailyReport
   *
   * @apiParam {Date} reportDate date
   * @apiParam {Number} numberOfTest number of Test
   * @apiParam {Number} numberOfImportedCases number of imported cases
   * @apiParam {Number} numberOfContactCases number of contact cases
   * @apiParam {Number} numberOfCommunityCases number of community cases
   * @apiParam {Number} numberOfRecoveredCases number of recovered cases
   * @apiParam {Number} numberOfDeadCases number of dead cases
   * @apiParam {Number} numberOfEvacuatedCases number of evacuated cases
   * @apiParam {Number} numberOfPositiveCases number of positive cases
   * @apiParam {Number} totalUnderTreatment total under treatment
   * @apiParam {Number} totalRecovered total recovered
   * @apiParam {Number} totalDeath total death
   * @apiParam {Number} totalEvacuation total evacuation
   * @apiParam {Number} totalCases total cases
   * @apiParam {String} dailyStatement
   * @apiSuccess (Success 201) {Boolean} success If it works ot not
   * @apiSuccess (Success 201) {String} message Response message
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "success": true,
   *       "message": "Successfully created."
   *     }
   */
  async create(req, res) {
    //filename=req.file.path.replace('pdf','').replace('/','').replace('\\','');
    filename = Date.now() + ".pdf";
    var jsonPath = path.join(__dirname, '..', 'pdf', filename);
    let pdfBuffer = await request.get({uri: req.body.dailyStatement, encoding: null});
    fs.writeFileSync(jsonPath, pdfBuffer);
    console.log(filename);
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
      totalCases: req.body.totalCases,
      dailyStatement: filename
    };

    // check if the report for the date (reportDate) already exist
    const dailyReport = await DailyReport.findOne({where: {reportDate: reportDate}});

    if (dailyReport === null) {
      // if it doesn't exist we create it
      DailyReport.create(data)
        .then((dailyReport) => {
          res.status(201).send({
            success: true,
            message: 'Successfully created.'
          });
        })
        .catch((error) => res.status(400).send(error));
    } else {
      // if it exist we just update it
      DailyReport.update(
        data,
        {where: {reportDate: reportDate}}
      )
        .then((dailyReport) => {
          res.status(201).send({
            success: true,
            message: 'Successfully updated.'
          });
        })
        .catch((error) => res.status(400).send(error));
    }
  },

  /**
   * @api {get} /daily-report Get all daily report
   * @apiName GetAllDailyReport
   * @apiGroup DailyReport
   *
   * @apiSuccess (Success 200) {Object[]} dailyReports List of daily report
   * @apiSuccess (Success 200) {Number} dailyReports.id ID
   * @apiSuccess (Success 200) {Date} dailyReports.reportDate date
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfTest number of Test
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfImportedCases number of imported cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfContactCases number of contact cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfCommunityCases number of community cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfRecoveredCases number of recovered cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfDeadCases number of dead cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfEvacuatedCases number of evacuated cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfPositiveCases number of positive cases
   * @apiSuccess (Success 200) {Number} dailyReports.totalUnderTreatment total under treatment
   * @apiSuccess (Success 200) {Number} dailyReports.totalRecovered total recovered
   * @apiSuccess (Success 200) {Number} dailyReports.totalDeath total death
   * @apiSuccess (Success 200) {Number} dailyReports.totalEvacuation total evacuation
   * @apiSuccess (Success 200) {Number} dailyReports.totalCases total cases
   * @apiSuccess (Success 200) {Date} dailyReports.updatedAt Creation date
   * @apiSuccess (Success 200) {Date} dailyReports.createdAt Modification date
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "dailyReports": [
   *         {
   *           "id": 1,
   *           "reportDate": "2020-04-19",
   *           "numberOfTest": 313,
   *           "numberOfImportedCases": 0,
   *           "numberOfContactCases": 15,
   *           "numberOfCommunityCases": 2,
   *           "numberOfRecoveredCases": 9,
   *           "numberOfDeadCases": 0,
   *           "numberOfEvacuatedCases": 0,
   *           "totalUnderTreatment": 143,
   *           "totalRecovered": 220,
   *           "totalDeath": 3,
   *           "totalEvacuation": 1,
   *           "numberOfPositiveCases": 17,
   *           "dailyStatement":,
   *           "totalCases": 367,
   *           "createdAt": "2020-04-19T17:14:22.826Z",
   *           "updatedAt": "2020-04-22T12:12:35.067Z"
   *         }
   *       ]
   *     }
   */
  getAll(req, res) {
    DailyReport.findAll()
      .then((dailyReports) => {
        res.status(200).send({
          dailyReports,
        });
      })
      .catch((error) => res.status(400).send(error));
  },

  /**
   * @api {get} /daily-report/last Get the last daily report
   * @apiName GetLastDailyReport
   * @apiGroup DailyReport
   *
   * @apiSuccess (Success 200) {Object[]} dailyReports List of daily report
   * @apiSuccess (Success 200) {Number} dailyReports.id ID
   * @apiSuccess (Success 200) {Date} dailyReports.reportDate date
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfTest number of Test
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfImportedCases number of imported cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfContactCases number of contact cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfCommunityCases number of community cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfRecoveredCases number of recovered cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfDeadCases number of dead cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfEvacuatedCases number of evacuated cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfPositiveCases number of positive cases
   * @apiSuccess (Success 200) {Number} dailyReports.totalUnderTreatment total under treatment
   * @apiSuccess (Success 200) {Number} dailyReports.totalRecovered total recovered
   * @apiSuccess (Success 200) {Number} dailyReports.totalDeath total death
   * @apiSuccess (Success 200) {Number} dailyReports.totalEvacuation total evacuation
   * @apiSuccess (Success 200) {Number} dailyReports.totalCases total cases
   * @apiSuccess (Success 200) {Date} dailyReports.updatedAt Creation date
   * @apiSuccess (Success 200) {Date} dailyReports.createdAt Modification date
   * @apiSuccess (Success 200) {String} dailyReports.dailyStatement
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "dailyReports": [
   *         {
   *           "id": 1,
   *           "reportDate": "2020-04-19",
   *           "numberOfTest": 313,
   *           "numberOfImportedCases": 0,
   *           "numberOfContactCases": 15,
   *           "numberOfCommunityCases": 2,
   *           "numberOfRecoveredCases": 9,
   *           "numberOfDeadCases": 0,
   *           "numberOfEvacuatedCases": 0,
   *           "totalUnderTreatment": 143,
   *           "totalRecovered": 220,
   *           "totalDeath": 3,
   *           "totalEvacuation": 1,
   *           "numberOfPositiveCases": 17,
   *           "dailyStatement":,
   *           "totalCases": 367,
   *           "createdAt": "2020-04-19T17:14:22.826Z",
   *           "updatedAt": "2020-04-22T12:12:35.067Z"
   *         }
   *       ]
   *     }
   */
  getLast(req, res) {
    DailyReport.findAll({
      limit: 1,
      order: [['reportDate', 'DESC']]
    })
      .then((dailyReports) => {
        res.status(200).send({
          dailyReports,
        });
      })
      .catch((error) => res.status(400).send(error));
  },

  /**
   * @api {get} /daily-report/last-with-diff Get the last daily report with diff
   * @apiName GetLastDailyReportWithDiff
   * @apiGroup DailyReport
   *
   * @apiSuccess (Success 200) {Object} dailyReportWithDiff daily report with diff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.id ID
   * @apiSuccess (Success 200) {Date} dailyReportWithDiff.reportDate date
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfTest number of Test
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfImportedCases number of imported cases
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfContactCases number of contact cases
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfCommunityCases number of community cases
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfRecoveredCases number of recovered cases
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfDeadCases number of dead cases
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfEvacuatedCases number of evacuated cases
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfPositiveCases number of positive cases
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.totalUnderTreatment total under treatment
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.totalRecovered total recovered
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.totalDeath total death
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.totalEvacuation total evacuation
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.totalCases total cases
   * @apiSuccess (Success 200) {String} dailyReportWithDiff.dailyStatement
   * @apiSuccess (Success 200) {Date} dailyReportWithDiff.updatedAt Creation date
   * @apiSuccess (Success 200) {Date} dailyReportWithDiff.createdAt Modification date
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfTestDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfImportedCasesDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfContactCasesDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfCommunityCasesDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfRecoveredCasesDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfDeadCasesDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfEvacuatedCasesDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.totalUnderTreatmentDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.totalRecoveredDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.totalDeathDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.totalEvacuationDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.numberOfPositiveCasesDiff
   * @apiSuccess (Success 200) {Number} dailyReportWithDiff.totalCasesDiff
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "dailyReportWithDiff": {
   *         "id": 176,
   *         "reportDate": "2020-04-25",
   *         "numberOfTest": 703,
   *         "numberOfImportedCases": 0,
   *         "numberOfContactCases": 63,
   *         "numberOfCommunityCases": 6,
   *         "numberOfRecoveredCases": 14,
   *         "numberOfDeadCases": 1,
   *         "numberOfEvacuatedCases": 0,
   *         "totalUnderTreatment": 330,
   *         "totalRecovered": 276,
   *         "totalDeath": 7,
   *         "totalEvacuation": 1,
   *         "numberOfPositiveCases": 69,
   *         "totalCases": 614,
   *         "dailyStatement": null,
   *         "createdAt": "2020-04-25T00:00:00.000Z",
   *         "updatedAt": "2020-04-25T00:00:00.000Z",
   *         "numberOfTestDiff": 175,
   *         "numberOfImportedCasesDiff": 0,
   *         "numberOfContactCasesDiff": 2,
   *         "numberOfCommunityCasesDiff": 1,
   *         "numberOfRecoveredCasesDiff": 9,
   *         "numberOfDeadCasesDiff": 1,
   *         "numberOfEvacuatedCasesDiff": 0,
   *         "totalUnderTreatmentDiff": 54,
   *         "totalRecoveredDiff": 14,
   *         "totalDeathDiff": 1,
   *         "totalEvacuationDiff": 0,
   *         "numberOfPositiveCasesDiff": 3,
   *         "totalCasesDiff": 69
   *       }
   *     }
   */
  async getLastWithDiff(req, res) {
    var currentReport = await DailyReport.findOne({
      limit: 1,
      order: [['reportDate', 'DESC']]
    });

    var previousReport = await DailyReport.findOne({
      limit: 1,
      offset: 1,
      order: [['reportDate', 'DESC']]
    });

    var dailyReportWithDiff = {
      id: currentReport.id,
      reportDate: currentReport.reportDate,
      numberOfTest: currentReport.numberOfTest,
      numberOfImportedCases: currentReport.numberOfImportedCases,
      numberOfContactCases: currentReport.numberOfContactCases,
      numberOfCommunityCases: currentReport.numberOfCommunityCases,
      numberOfRecoveredCases: currentReport.numberOfRecoveredCases,
      numberOfDeadCases: currentReport.numberOfDeadCases,
      numberOfEvacuatedCases: currentReport.numberOfEvacuatedCases,
      totalUnderTreatment: currentReport.totalUnderTreatment,
      totalRecovered: currentReport.totalRecovered,
      totalDeath: currentReport.totalDeath,
      totalEvacuation: currentReport.totalEvacuation,
      numberOfPositiveCases: currentReport.numberOfPositiveCases,
      totalCases: currentReport.totalCases,
      dailyStatement: currentReport.dailyStatement,
      createdAt: currentReport.createdAt,
      updatedAt: currentReport.updatedAt,

      numberOfTestDiff: currentReport.numberOfTest - previousReport.numberOfTest,
      numberOfImportedCasesDiff: currentReport.numberOfImportedCases - previousReport.numberOfImportedCases,
      numberOfContactCasesDiff: currentReport.numberOfContactCases - previousReport.numberOfContactCases,
      numberOfCommunityCasesDiff: currentReport.numberOfCommunityCases - previousReport.numberOfCommunityCases,
      numberOfRecoveredCasesDiff: currentReport.numberOfRecoveredCases - previousReport.numberOfRecoveredCases,
      numberOfDeadCasesDiff: currentReport.numberOfDeadCases - previousReport.numberOfDeadCases,
      numberOfEvacuatedCasesDiff: currentReport.numberOfEvacuatedCases - previousReport.numberOfEvacuatedCases,
      totalUnderTreatmentDiff: currentReport.totalUnderTreatment - previousReport.totalUnderTreatment,
      totalRecoveredDiff: currentReport.totalRecovered - previousReport.totalRecovered,
      totalDeathDiff: currentReport.totalDeath - previousReport.totalDeath,
      totalEvacuationDiff: currentReport.totalEvacuation - previousReport.totalEvacuation,
      numberOfPositiveCasesDiff: currentReport.numberOfPositiveCases - previousReport.numberOfPositiveCases,
      totalCasesDiff: currentReport.totalCases - previousReport.totalCases,
    }

    console.log(dailyReportWithDiff);

    res.status(200).send({
      dailyReportWithDiff
    });
  },

  /**
   * @api {get} /daily-report/:id Get a daily report by ID
   * @apiName GetDailyReportById
   * @apiGroup DailyReport
   *
   * @apiParam {Number} id id of the daily report
   *
   * @apiSuccess (Success 200) {Object[]} dailyReports List of daily report
   * @apiSuccess (Success 200) {Number} dailyReports.id ID
   * @apiSuccess (Success 200) {Date} dailyReports.reportDate date
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfTest number of Test
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfImportedCases number of imported cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfContactCases number of contact cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfCommunityCases number of community cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfRecoveredCases number of recovered cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfDeadCases number of dead cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfEvacuatedCases number of evacuated cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfPositiveCases number of positive cases
   * @apiSuccess (Success 200) {Number} dailyReports.totalUnderTreatment total under treatment
   * @apiSuccess (Success 200) {Number} dailyReports.totalRecovered total recovered
   * @apiSuccess (Success 200) {Number} dailyReports.totalDeath total death
   * @apiSuccess (Success 200) {Number} dailyReports.totalEvacuation total evacuation
   * @apiSuccess (Success 200) {Number} dailyReports.totalCases total cases
   * @apiSuccess (Success 200) {Date} dailyReports.updatedAt Creation date
   * @apiSuccess (Success 200) {Date} dailyReports.createdAt Modification date
   * @apiSuccess (Success 200) {String} dailyReports.dailyStatement
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "dailyReports": [
   *         {
   *           "id": 1,
   *           "reportDate": "2020-04-19",
   *           "numberOfTest": 313,
   *           "numberOfImportedCases": 0,
   *           "numberOfContactCases": 15,
   *           "numberOfCommunityCases": 2,
   *           "numberOfRecoveredCases": 9,
   *           "numberOfDeadCases": 0,
   *           "numberOfEvacuatedCases": 0,
   *           "totalUnderTreatment": 143,
   *           "totalRecovered": 220,
   *           "totalDeath": 3,
   *           "totalEvacuation": 1,
   *           "numberOfPositiveCases": 17,
   *           "dailyStatement": ".../file.pdf",
   *           "totalCases": 367,
   *           "createdAt": "2020-04-19T17:14:22.826Z",
   *           "updatedAt": "2020-04-22T12:12:35.067Z"
   *         }
   *       ]
   *     }
   */
  get(req, res) {
    const {id} = req.params;
    DailyReport.findAll({
      where: {
        id: id
      }
    })
      .then((dailyReports) => {
        res.status(200).send({
          dailyReports,
        });
      })
      .catch((error) => res.status(400).send(error));
  },

  /**
   * @api {get} /daily-report/by-date/:date Get a daily report by date
   * @apiName GetDailyReportByDate
   * @apiGroup DailyReport
   *
   * @apiParam {Date} date date of the daily report (format AAAA-MM-JJ, example : 2020-04-20)
   *
   * @apiSuccess (Success 200) {Object[]} dailyReports List of daily report
   * @apiSuccess (Success 200) {Number} dailyReports.id ID
   * @apiSuccess (Success 200) {Date} dailyReports.reportDate date
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfTest number of Test
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfImportedCases number of imported cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfContactCases number of contact cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfCommunityCases number of community cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfRecoveredCases number of recovered cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfDeadCases number of dead cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfEvacuatedCases number of evacuated cases
   * @apiSuccess (Success 200) {Number} dailyReports.numberOfPositiveCases number of positive cases
   * @apiSuccess (Success 200) {Number} dailyReports.totalUnderTreatment total under treatment
   * @apiSuccess (Success 200) {Number} dailyReports.totalRecovered total recovered
   * @apiSuccess (Success 200) {Number} dailyReports.totalDeath total death
   * @apiSuccess (Success 200) {Number} dailyReports.totalEvacuation total evacuation
   * @apiSuccess (Success 200) {Number} dailyReports.totalCases total cases
   * @apiSuccess (Success 200) {Date} dailyReports.updatedAt Creation date
   * @apiSuccess (Success 200) {Date} dailyReports.createdAt Modification date
   * @apiSuccess (Success 200) {String} dailyReports.dailyStatement
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "dailyReports": [
   *         {
   *           "id": 1,
   *           "reportDate": "2020-04-19",
   *           "numberOfTest": 313,
   *           "numberOfImportedCases": 0,
   *           "numberOfContactCases": 15,
   *           "numberOfCommunityCases": 2,
   *           "numberOfRecoveredCases": 9,
   *           "numberOfDeadCases": 0,
   *           "numberOfEvacuatedCases": 0,
   *           "totalUnderTreatment": 143,
   *           "totalRecovered": 220,
   *           "totalDeath": 3,
   *           "totalEvacuation": 1,
   *           "numberOfPositiveCases": 17,
   *           "dailyStatement": ".../file.pdf",
   *           "totalCases": 367,
   *           "createdAt": "2020-04-19T17:14:22.826Z",
   *           "updatedAt": "2020-04-22T12:12:35.067Z"
   *         }
   *       ]
   *     }
   */
  getByDate(req, res) {
    const {date} = req.params;
    DailyReport.findAll({
      where: {
        reportDate: date
      }
    })
      .then((dailyReports) => {
        res.status(200).send({
          dailyReports,
        });
      })
      .catch((error) => res.status(400).send(error));
  },

  getPDf(req, res) {
    var data = fs.readFileSync('./pdf/' + req.params.filename);
    res.contentType("application/pdf");
    res.send(data);
  }
};
