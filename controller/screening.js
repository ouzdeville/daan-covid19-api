const {Screening, SelfReporting} = require('../models');

module.exports = {
    /**
     * @api {post} /screening Add screening
     * @apiName CreateScreening
     * @apiGroup Screening
     *
     * @apiParam {Number} idSelfReporting id of the self reporting
     * @apiParam {Date} samplingDate sampling date
     * @apiParam {Date} screeningDate screening date
     * @apiParam {String} result result
     * @apiParam {String} caseType caseType ('CONTACT', 'COMMUNITY', 'IMPORTED')
     * @apiParam {String} healthFacility healthFacility
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {String} message Response message
     *
     * @apiError (Error 404) {Boolean} success false
     * @apiError (Error 404) {String} message Response message
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created."
     *     }
     *
     *     @apiErrorExample Success-Response:
     *     HTTP/1.1 4O4 Not Found
     *     {
     *       "success": false,
     *       "message": "Self Reporting not found."
     *     }
     */
    async create(req, res) {
        const data = {
            idSelfReporting: req.body.idSelfReporting,
            samplingDate: req.body.samplingDate,
            screeningDate: req.body.screeningDate,
            result: req.body.result,
            caseType: req.body.caseType,
            healthFacility: req.body.healthFacility,
        };

        let selfReporting = await SelfReporting.findOne({
            where: {
                id: data.idSelfReporting
            }
        });

        if (selfReporting === null) {
            res.status(404).send({
                success: false,
                message: 'Self Reporting not found.'
            });
        } else {
            Screening.create(data)
                .then((screening) => {
                    res.status(201).send({
                        success: true,
                        message: 'Successfully created.'
                    });
                })
                .catch((error) => res.status(400).send(error));
        }
    },

    /**
     * @api {get} /screening Get all screening
     * @apiName GetAllScreening
     * @apiGroup Screening
     *
     * @apiSuccess (Success 200) {Object[]} screenings List of screenings
     * @apiSuccess (Success 200) {Number} screenings.idSelfReporting id of the self reporting
     * @apiSuccess (Success 200) {Date} screenings.samplingDate sampling date
     * @apiSuccess (Success 200) {Date} screenings.screeningDate screening date
     * @apiSuccess (Success 200) {String} screenings.result result
     * @apiSuccess (Success 200) {String} screenings.caseType caseType ('CONTACT', 'COMMUNITY', 'IMPORTED')
     * @apiSuccess (Success 200) {String} screenings.healthFacility healthFacility
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "screenings": [
     *         {
     *           "id": 1,
     *           "idSelfReporting": 2,
     *           "samplingDate": "2020-05-14",
     *           "screeningDate": "2020-05-14",
     *           "result": 'Positif',
     *           "caseType": 'CONTACT',
     *           "healthFacility": 'Hopital Fann',
     *           "createdAt": "2020-04-19T17:14:22.826Z",
     *           "updatedAt": "2020-04-22T12:12:35.067Z"
     *         }
     *       ]
     *     }
     */
    getAll(req, res) {
        Screening.findAll()
            .then((screenings) => {
                res.status(200).send({
                    screenings,
                });
            })
            .catch((error) => res.status(400).send(error));
    },
}