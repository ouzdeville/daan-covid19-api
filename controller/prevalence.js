const { Prevalence, Zone } = require('./../models');
const { prevalenceCron } = require('./../utils');
var moment = require('moment');
var fs = require('fs');

module.exports = {
    /**
     * @api {post} /prevalence Add Prevalence
     * @apiName CreatePrevalence
     * @apiGroup Prevalence
     *
     * @apiParam {Number} idZone Zone id
     * @apiParam {Date} date date
     * @apiParam {Number} numberOfConfirmedCases number of confirmed cases
     * @apiParam {Number} numberOfSupectedCases number of supected cases
     * @apiParam {Number} numberOfContactsCases number of contacts cases
     * @apiParam {Number} numberOfRecoveredCases number of recovered cases
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {String} message Response message
     * @apiSuccess (Success 201) {Object} prevalence Prevalence object
     * @apiSuccess (Success 201) {Number} prevalence.id Prevalence id
     * @apiSuccess (Success 201) {Number} prevalence.idZone Zone id
     * @apiSuccess (Success 201) {Date} prevalence.date date
     * @apiSuccess (Success 201) {Number} prevalence.numberOfConfirmedCases number of confirmed cases
     * @apiSuccess (Success 201) {Number} prevalence.numberOfSupectedCases number of supected cases
     * @apiSuccess (Success 201) {Number} prevalence.numberOfContactsCases number of contacts cases
     * @apiSuccess (Success 201) {Number} prevalence.numberOfRecoveredCases number of recovered cases
     * @apiSuccess (Success 201) {Date} prevalence.updatedAt Creation date
     * @apiSuccess (Success 201) {Date} prevalence.createdAt Modification date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created.",
     *       "prevalence": {
     *         "id": 6,
     *         "idZone": "b967a828-7df4-459b-906d-f3ff4f8a05be",
     *         "date": "2020-04-19",
     *         "numberOfConfirmedCases": 10,
     *         "numberOfSupectedCases": 47,
     *         "numberOfContactsCases": 8,
     *         "numberOfRecoveredCases": 12,
     *         "updatedAt": "2020-04-20T22:55:41.419Z",
     *         "createdAt": "2020-04-20T22:55:41.419Z"
     *       }
     *     }
     */
    create(req, res) {
        const data = {
            idZone: req.body.idZone,
            date: req.body.date,
            numberOfConfirmedCases: req.body.numberOfConfirmedCases,
            numberOfSupectedCases: req.body.numberOfSupectedCases,
            numberOfContactsCases: req.body.numberOfContactsCases,
            numberOfRecoveredCases: req.body.numberOfRecoveredCases
        };

        Prevalence.create(data)
            .then((prevalence) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    prevalence,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /prevalences Get all prevalence
     * @apiName GetPrevalence
     * @apiGroup Prevalence
     *
     * @apiSuccess (Success 200) {Object[]} prevalences List of prevalences
     * @apiSuccess (Success 200) {Number} prevalences.id Prevalence id
     * @apiSuccess (Success 200) {Number} prevalences.idZone Zone id
     * @apiSuccess (Success 200) {Date} prevalences.date date
     * @apiSuccess (Success 200) {Number} prevalences.numberOfConfirmedCases number of confirmed cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfSupectedCases number of supected cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfContactsCases number of contacts cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfRecoveredCases number of recovered cases
     * @apiSuccess (Success 200) {Date} prevalences.updatedAt Creation date
     * @apiSuccess (Success 200) {Date} prevalences.createdAt Modification date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "prevalences": [
     *         {
     *           "id": 5,
     *           "idZone": "b967a828-7df4-459b-906d-f3ff4f8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-19T15:54:16.521Z",
     *           "updatedAt": "2020-04-19T15:54:16.521Z"
     *         },
     *         {
     *           "id": 6,
     *           "idZone": "b967a828-7dp4-459b-906a-f3ffdf8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-20T22:55:41.419Z",
     *           "updatedAt": "2020-04-20T22:55:41.419Z"
     *         }
     *       ]
     *     }
     */
    getAll(req, res) {
        Prevalence.findAll({
            include: [{
                model: Zone,
            }],
            order: [['createdAt', 'DESC']]
        })
            .then((prevalences) => {
                res.status(200).send({
                    prevalences,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /prevalence Get all actual prevalences
     * @apiName GetPrevalence
     * @apiGroup Prevalence
     *
     * @apiSuccess (Success 200) {Object[]} prevalences List of prevalences
     * @apiSuccess (Success 200) {Number} prevalences.id Prevalence id
     * @apiSuccess (Success 200) {Number} prevalences.idZone Zone id
     * @apiSuccess (Success 200) {Date} prevalences.date date
     * @apiSuccess (Success 200) {Number} prevalences.numberOfConfirmedCases number of confirmed cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfSupectedCases number of supected cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfContactsCases number of contacts cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfRecoveredCases number of recovered cases
     * @apiSuccess (Success 200) {Date} prevalences.updatedAt Creation date
     * @apiSuccess (Success 200) {Date} prevalences.createdAt Modification date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "prevalences": [
     *         {
     *           "id": 5,
     *           "idZone": "b967a828-7df4-459b-906d-f3ff4f8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-19T15:54:16.521Z",
     *           "updatedAt": "2020-04-19T15:54:16.521Z"
     *         },
     *         {
     *           "id": 6,
     *           "idZone": "b967a828-7dp4-459b-906a-f3ffdf8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-20T22:55:41.419Z",
     *           "updatedAt": "2020-04-20T22:55:41.419Z"
     *         }
     *       ]
     *     }
     */
    async getprevalenceNow(req, res) {
        var now = await moment().format("YYYY-MM-DD")
        const { count } = await Zone.findAndCountAll();
        Prevalence.findAll({
            limit: count,
            where: {
                date: now,
            },
            include: [{
                model: Zone,
            }],
            order: [['createdAt', 'DESC']]
        })
            .then((prevalences) => {
                res.status(200).send({
                    prevalences,
                });
            })
            .catch((error) => res.status(400).send(error));
    },
    /**
     * @api {get} /prevalence/:idZone Get all prevalence by Zone
     * @apiName GetPrevalenceByZone
     * @apiGroup Prevalence
     *
     * @apiParam {UUID} idZone id of the zone
     *
     * @apiSuccess (Success 200) {Object[]} prevalences List of prevalences
     * @apiSuccess (Success 200) {Number} prevalences.id Prevalence id
     * @apiSuccess (Success 200) {Number} prevalences.idZone Zone id
     * @apiSuccess (Success 200) {Date} prevalences.date date
     * @apiSuccess (Success 200) {Number} prevalences.numberOfConfirmedCases number of confirmed cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfSupectedCases number of supected cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfContactsCases number of contacts cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfRecoveredCases number of recovered cases
     * @apiSuccess (Success 200) {Date} prevalences.updatedAt Creation date
     * @apiSuccess (Success 200) {Date} prevalences.createdAt Modification date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "prevalences": [
     *         {
     *           "id": 5,
     *           "idZone": "b967a828-7df4-459b-906d-f3ff4f8a05be",
     *           "date": "2020-04-20",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-19T15:54:16.521Z",
     *           "updatedAt": "2020-04-19T15:54:16.521Z"
     *         },
     *         {
     *           "id": 6,
     *           "idZone": "b967a828-7df4-459b-906d-f3ff4f8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-20T22:55:41.419Z",
     *           "updatedAt": "2020-04-20T22:55:41.419Z"
     *         }
     *       ]
     *     }
     */

    getByZone(req, res) {
        const { idZone } = req.params;
        Prevalence.findAll({
            where: {
                idZone: idZone
            }
        })
            .then((prevalences) => {
                res.status(200).send({
                    prevalences,
                });
            })
            .catch((error) => res.status(400).send(error));
    },
    /**
     * @api {get} /prevalence/run Refresh prevalence from COUS
     * @apiName runPrevalence
     * @apiGroup Prevalence
     *
     * @apiSuccess (Success 200) {String} message
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "message":
     *     }
     */

    async runPrevalence(req, res) {
        try {
            await prevalenceCron.prevalenceCompute();


            res.status(200).send({
                success: true,
                code: 99,
                message: "Refresh done",
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
            });

        }
    },
    /**
     * @api {get} /prevalence/rungps Get Update district GPS
     * @apiName runGPS
     * @apiGroup Prevalence
     *
     * @apiSuccess (Success 200) {String} message
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "message":
     *     }
     */

    async updateGPS(req, res) {

        try {
            var districtsgps = await require('./../init_data/districts-sn.json');
            for (var district of districtsgps) {
                //console.log(district);
                await Zone.update(
                    {
                        longitude: district.geometry.x,
                        latitude: district.geometry.y
                    },
                    {
                        where: {
                            name: district.attributes.NAME
                        }
                    });

            }
        } catch (error) {
            console.error(error);
            res.status(400).send(error)
        };

        res.status(200).send({
            success: true,
            code: 99,
            message: "Refresh done",
        });

    },

    /**
     * @api {get} /prevalence/runPolygone  Update district polygone GPS
     * @apiName runPolygone
     * @apiGroup Prevalence
     *
     * @apiSuccess (Success 200) {String} message
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "message":
     *     }
     */

    async runPolygon(req, res) {

        try {
            var districtsgps = JSON.parse(fs.readFileSync('./init_data/Districts.geojson', 'utf8'));
            //console.log(districtsgps.features.length);
            for (var district of districtsgps.features) {
                var polygon = district.geometry.coordinates[0][0];
                await Zone.update(
                    {
                        polygon: polygon,
                    },
                    {
                        where: {
                            name: district.properties.NomDS.toUpperCase().split(' ').join('-')
                        }
                    });


            }
        } catch (error) {
            console.error(error);
            res.status(400).send(error)
        };

        res.status(200).send({
            success: true,
            code: 99,
            message: "Refresh done",
        });

    }
};
