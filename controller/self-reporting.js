const {
    SelfReporting, Symptom, RiskFactor, User,
    SelfReporting_Symptom, SelfReporting_RiskFactor
} = require('./../models')


module.exports = {
    /**
     * @api {get} /reporting/self-reports get all self-reports
     * @apiName getAllSelfReports
     * @apiGroup Reporting
     *
     *
     * @apiSuccess (Success 200) {Object} result self-reports list
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       [
     *           {
     *               "id": 1,
     *               "reportingDate": null,
     *               "firstname": "side",
     *               "lastname": "sarr",
     *               "email": null,
     *               "adresse": null,
     *               "department": null,
     *               "region": null,
     *               "lat": null,
     *               "lng": null,
     *               "User": {
     *                   "id": "dc76809c-23b2-4e0d-91ce-14aa46aeb5b4",
     *                   "phone": "+221776359893",
     *                   "active": "active"
     *               },
     *               "Symptom": [],
     *               "RiskFactor": [
     *                   {
     *                       "id": 2,
     *                       "name": "Consommation d'alcool",
     *                       "description": "",
     *                       "type": "1",
     *                       "SelfReporting_RiskFactor": {
     *                           "idSelfReporting": 2,
     *                           "idRiskFactor": 1,
     *                           "createdAt": "2020-04-22T21:18:48.078Z",
     *                           "updatedAt": "2020-04-22T21:18:48.078Z"
     *                       }
     *                   }
     *               ]
     *           },
     *           {
     *               "id": 2,
     *               "reportingDate": null,
     *               "firstname": "Demba",
     *               "lastname": "Diaw",
     *               "email": "demba@gmail.com",
     *               "adresse": "dakar",
     *               "department": null,
     *               "region": null,
     *               "lat": null,
     *               "lng": null,
     *               "User": {
     *                   "id": "1ca8f3b7-905a-4b60-9a31-eed78142e5e4",
     *                   "phone": "+221776359894",
     *                   "active": "active"
     *               },
     *               "Symptom": [],
     *               "RiskFactor": [
     *                   {
     *                       "id": 2,
     *                       "name": "Consommation d'alcool",
     *                       "description": "",
     *                       "type": "1",
     *                       "SelfReporting_RiskFactor": {
     *                           "idSelfReporting": 2,
     *                           "idRiskFactor": 2,
     *                          "createdAt": "2020-04-22T21:18:48.078Z",
     *                          "updatedAt": "2020-04-22T21:18:48.078Z"
     *                      }
     *                  }
     *              ]
     *          }
     *      ]
     *
     *
     *     }
     */
    getAllSelfReports(req, res) {
        //res.send({ message: 'hi :)' });
        SelfReporting.findAll({
            attributes: ['id', 'reportingDate', 'firstname', 'lastname', 'email', 'adresse', 'department', 'region', 'lat', 'lng'],
            include: [{
                model: User, attributes: ['id', 'phone', 'active'],
            }, {
                model: Symptom, attributes: ['id', 'name', 'description', 'major'],
                as: 'Symptom'
            }, {
                model: RiskFactor, attributes: ['id', 'name', 'description', 'type'],
                as: 'RiskFactor'
            }],
        })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving self-reports."
                });
            });
    },

    /**
     * @api {get} /reporting/self-reports/by-user/:id get all self-reports by user id
     * @apiName getAllSelfReportsByUserId
     * @apiGroup Reporting
     *
     *
     * @apiParam {Number} id    id of User
     *
     * @apiSuccess (Success 200) {Object} result self-reports list
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       *       [
     *           {
     *               "id": 1,
     *               "reportingDate": null,
     *               "firstname": "side",
     *               "lastname": "sarr",
     *               "email": null,
     *               "adresse": null,
     *               "department": null,
     *               "region": null,
     *               "lat": null,
     *               "lng": null,
     *               "User": {
     *                   "id": "dc76809c-23b2-4e0d-91ce-14aa46aeb5b4",
     *                   "phone": "+221776359893",
     *                   "active": "active"
     *               },
     *               "Symptom": [],
     *               "RiskFactor": [
     *                   {
     *                       "id": 2,
     *                       "name": "Consommation d'alcool",
     *                       "description": "",
     *                       "type": "1",
     *                       "SelfReporting_RiskFactor": {
     *                           "idSelfReporting": 2,
     *                           "idRiskFactor": 1,
     *                           "createdAt": "2020-04-22T21:18:48.078Z",
     *                           "updatedAt": "2020-04-22T21:18:48.078Z"
     *                       }
     *                   }
     *               ]
     *           },
     *           {
     *               "id": 2,
     *               "reportingDate": null,
     *               "firstname": "Demba",
     *               "lastname": "Diaw",
     *               "email": "demba@gmail.com",
     *               "adresse": "dakar",
     *               "department": null,
     *               "region": null,
     *               "lat": null,
     *               "lng": null,
     *               "User": {
     *                   "id": "1ca8f3b7-905a-4b60-9a31-eed78142e5e4",
     *                   "phone": "+221776359894",
     *                   "active": "active"
     *               },
     *               "Symptom": [],
     *               "RiskFactor": [
     *                   {
     *                       "id": 2,
     *                       "name": "Consommation d'alcool",
     *                       "description": "",
     *                       "type": "1",
     *                       "SelfReporting_RiskFactor": {
     *                           "idSelfReporting": 2,
     *                           "idRiskFactor": 2,
     *                          "createdAt": "2020-04-22T21:18:48.078Z",
     *                          "updatedAt": "2020-04-22T21:18:48.078Z"
     *                      }
     *                  }
     *              ]
     *          }
     *      ]
     *
     *
     *     }
     */
    getAllSelfReportsByUserId(req, res) {
        const {id} = req.params;
        SelfReporting.findAll({
            attributes: ['id', 'reportingDate', 'firstname', 'lastname', 'email', 'adresse', 'department', 'region', 'lat', 'lng'],
            include: [{
                model: User, attributes: ['id', 'phone', 'active'],
                where: {id: id}
            }, {
                model: Symptom, attributes: ['id', 'name', 'description', 'major'],
                as: 'Symptom'
            }, {
                model: RiskFactor, attributes: ['id', 'name', 'description', 'type'],
                as: 'RiskFactor'
            }],
        })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving self-reports."
                });
            });
    },

    /**
     * @api {get} /reporting/self-reports/:id get self-reports by id
     * @apiName getSelfReportById
     * @apiGroup Reporting
     *
     *
     * @apiParam {Number} id id of the report
     *
     * @apiSuccess (Success 200) {Object} result self-reports list
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       [
     *           {
     *               "id": 2,
     *               "reportingDate": null,
     *               "firstname": "Demba",
     *               "lastname": "Diaw",
     *               "email": "demba@gmail.com",
     *               "adresse": "dakar",
     *               "department": null,
     *               "region": null,
     *               "lat": null,
     *               "lng": null,
     *               "User": {
     *                   "id": "1ca8f3b7-905a-4b60-9a31-eed78142e5e4",
     *                   "phone": "+221776359894",
     *                   "active": "active"
     *               },
     *               "Symptom": [],
     *               "RiskFactor": [
     *                   {
     *                       "id": 2,
     *                       "name": "Consommation d'alcool",
     *                       "description": "",
     *                       "type": "1",
     *                       "SelfReporting_RiskFactor": {
     *                           "idSelfReporting": 2,
     *                           "idRiskFactor": 2,
     *                          "createdAt": "2020-04-22T21:18:48.078Z",
     *                          "updatedAt": "2020-04-22T21:18:48.078Z"
     *                      }
     *                  }
     *              ]
     *          }
     *      ]
     *     }
     */
    getById(req, res) {
        const {id} = req.params;
        SelfReporting.findAll({
            attributes: ['id', 'reportingDate', 'firstname', 'lastname', 'email', 'adresse', 'department', 'region', 'lat', 'lng'],
            where: {id: id},
            include: [{
                model: User, attributes: ['id', 'phone', 'active']
            }, {
                model: Symptom, attributes: ['id', 'name', 'description', 'major'],
                as: 'Symptom'
            }, {
                model: RiskFactor, attributes: ['id', 'name', 'description', 'type'],
                as: 'RiskFactor'
            }],
        })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving self-reports."
                });
            });
    },

    /**
     * @api {get} /self-report/risk-factors/:idreport get all risk by report
     * @apiName getAllRiskByReport
     * @apiGroup Reporting
     *
     *
     * @apiParam {Number} id    id of Report
     *
     * @apiSuccess (Success 200) {Object} result risk list
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       [
     *             {
     *                 "id": 2,
     *                 "name": "Consommation d'alcool",
     *                 "description": "",
     *                 "type": "1",
     *                 "createdAt": "2020-04-22T21:18:48.078Z",
     *                 "updatedAt": "2020-04-22T21:18:48.078Z"
     *             },
     *             {
     *                 "id": 3,
     *                 "name": "Diabétique",
     *                 "description": "",
     *                 "type": "2",
     *                 "createdAt": "2020-04-22T21:18:48.078Z",
     *                 "updatedAt": "2020-04-22T21:18:48.078Z"
     *             }
     *         ]
     *     }
     */

    getAllRiskByReport(req, res) {
        const {idreport} = req.params;
        RiskFactor.findAll({
            include: [{
                model: SelfReporting, attributes: [],
                where: {id: idreport},
                as: 'SelfReporting'
            },
            ],
        }).then(selfreporting => {
            res.send(selfreporting);
        }).catch(err => {
            res.send(err);
        })
    },

    /**
     * @api {get} /self-report/:idreport/symptoms get all symptom by report
     * @apiName getAllSymptomByReport
     * @apiGroup Reporting
     *
     *
     * @apiParam {Number} id    id of Report
     *
     * @apiSuccess (Success 200) {Object} result risk list
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       [
     *             {
     *                 "id": 2,
     *                 "name": "Toux",
     *                 "description": "",
     *                 "major": true,
     *                 "img": "",
     *                 "createdAt": "2020-04-22T21:18:48.066Z",
     *                 "updatedAt": "2020-04-22T21:18:48.066Z"
     *             },
     *             {
     *                 "id": 1,
     *                 "name": "mal de tete",
     *                 "description": "",
     *                 "major": true,
     *                 "img": "",
     *                 "createdAt": "2020-04-22T21:18:48.066Z",
     *                 "updatedAt": "2020-04-25T14:44:48.494Z"
     *             }
     *         ]
     *     }
     */
    getAllSymptomByReport(req, res) {
        const {idreport} = req.params;
        Symptom.findAll({
            include: [{
                model: SelfReporting, attributes: [],
                where: { id: idreport },
                as: 'SelfReporting'
            },
            ],
        }).then(selfreporting => {
            res.send(selfreporting);
        }).catch(err => {
            res.send(err);
        })
    },

    /**
     * @api {get} /reporting/self-reports/:date get all self-reports by date
     * @apiName GetAllSelfReportsByDate
     * @apiGroup Reporting
     *
     *
     * @apiParam {Date} date    creation's date of SelfReporting
     *
     * @apiSuccess (Success 200) {Object} result self-reports list
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       *       [
     *           {
     *               "id": 1,
     *               "reportingDate": "2020-04-22",
     *               "firstname": "side",
     *               "lastname": "sarr",
     *               "email": null,
     *               "adresse": null,
     *               "department": null,
     *               "region": null,
     *               "User": {
     *                   "id": "dc76809c-23b2-4e0d-91ce-14aa46aeb5b4",
     *                   "phone": "+221776359893",
     *                   "active": "active"
     *               },
     *               "Symptom": [],
     *               "RiskFactor": [
     *                   {
     *                       "id": 2,
     *                       "name": "Consommation d'alcool",
     *                       "description": "",
     *                       "type": "1",
     *                       "SelfReporting_RiskFactor": {
     *                           "idSelfReporting": 2,
     *                           "idRiskFactor": 1,
     *                           "createdAt": "2020-04-22T21:18:48.078Z",
     *                           "updatedAt": "2020-04-22T21:18:48.078Z"
     *                       }
     *                   }
     *               ]
     *           },
     *           {
     *               "id": 2,
     *               "reportingDate": "2020-04-22",
     *               "firstname": "Demba",
     *               "lastname": "Diaw",
     *               "email": "demba@gmail.com",
     *               "adresse": "dakar",
     *               "department": null,
     *               "region": null,
     *               "User": {
     *                   "id": "1ca8f3b7-905a-4b60-9a31-eed78142e5e4",
     *                   "phone": "+221776359894",
     *                   "active": "active"
     *               },
     *               "Symptom": [],
     *               "RiskFactor": [
     *                   {
     *                       "id": 2,
     *                       "name": "Consommation d'alcool",
     *                       "description": "",
     *                       "type": "1",
     *                       "SelfReporting_RiskFactor": {
     *                           "idSelfReporting": 2,
     *                           "idRiskFactor": 2,
     *                          "createdAt": "2020-04-22T21:18:48.078Z",
     *                          "updatedAt": "2020-04-22T21:18:48.078Z"
     *                      }
     *                  }
     *              ]
     *          }
     *      ]
     *
     *
     *     }
     */
    getAllSelfReportsByDate(req, res) {
        //res.send({ message: 'hi :)' });
        const {date} = req.params;
        SelfReporting.findAll({
            where: {reportingDate: date},
            attributes: ['id', 'reportingDate', 'firstname', 'lastname', 'email', 'adresse', 'department', 'region',],
            include: [{
                model: User, attributes: ['id', 'phone', 'active'],

            }, {
                model: Symptom, attributes: ['id', 'name', 'description', 'major'],
                as: 'Symptom'
            }, {
                model: RiskFactor, attributes: ['id', 'name', 'description', 'type'],
                as: 'RiskFactor'
            }],
        })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving self-reports."
                });
            });
    },

    /**
     * @api {post} /user/selfreport Create seflReport
     * @apiName CreateSelfReporting
     * @apiGroup Reporting
     *
     * @apiParam {String} firstname
     * @apiParam {String} lastname
     * @apiParam {String} gender
     * @apiParam {Date} dateOfBirth
     * @apiParam {Number} age
     * @apiParam {String} email
     * @apiParam {String} adresse
     * @apiParam {String} department
     * @apiParam {String} region
     * @apiParam {Number} lat GPS latitude
     * @apiParam {Number} lng GPS longitude
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {Object} message
     * @apiSuccess (Success 201) {Number} id of the created object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 OK
     *     {
     *       "success": true,
     *       "id":1
     *
     *
     *     }
     */
    createSelfReporting(req, res) {
        const idUser = req.userID;
        const {
            firstname, lastname, gender, dateOfBirth, age,
            email, adresse, department, region, lat, lng
        } = req.body;
        try {
            if (idUser == null) {
                res.status(400).send({
                    success: false,
                    message: 'idUser is wrong',
                    idUser: idUser,
                });
                return;
            }
            SelfReporting.create({
                idUser,
                firstname,
                lastname,
                gender,
                dateOfBirth,
                age,
                email,
                adresse,
                department,
                region,
                lat,
                lng
            }).then((report) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    id: report.id,
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
                message: error.message || "Some error occurred while creating self-reports."
            });
        }
    },

    /**
     * @api {put} /reporting/modify-self-report Update SelfReporting
     * @apiName Update
     * @apiGroup RiskFactor
     *
     * @apiParam {String} firstname
     * @apiParam {String} lastname
     * @apiParam {String} gender
     * @apiParam {Date} dateOfBirth
     * @apiParam {Number} age
     * @apiParam {String} email
     * @apiParam {String} adresse
     * @apiParam {String} department
     * @apiParam {String} region
     * @apiParam {Number} latitude GPS latitude
     * @apiParam {Number} longitude GPS longitude
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 Updated
     *     {
     *         "success" : true,
     *         "code"    : 1,
     *         "message": 'RiskFactor successfully updated',
     *         "riskfactor": "updaterisk-factor"
     *     }
     */
    updateUserSelfReport(req, res) {
        const {
            id, firstname, lastname, gender, dateOfBirth, age,
            email, adresse, department, region, lat, lng, idUser
        } = req.query;
        return SelfReporting.findOne({
            where: {id: id},
        }).then(selfreporting => {
            if (!selfreporting) {
                return res.status(404).send({
                    success: true,
                    code: 0,
                    message: 'selfreporting Not Found',
                });
            }
            return selfreporting.update({
                id: idUser || selfreporting.id,
                firstname: firstname || selfreporting.firstname,
                lastname: lastname || selfreporting.lastname,
                gender: gender || selfreporting.gender,
                dateOfBirth: dateOfBirth || selfreporting.dateOfBirth,
                age: age || selfreporting.age,
                email: email || selfreporting.email,
                adresse: adresse || selfreporting.adresse,
                departement: department || selfreporting.departement,
                region: region || selfreporting.region,
                lat: lat || selfreporting.lat,
                lng: lng || selfreporting.lng

            }).then(() => res.status(200).send({
                success: true,
                code: 1,
                message: 'riskFactor successfully updated',
                riskfactor: "updaterisk-factor"
            }))
                .catch((error) => res.status(400).send(error));
        })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {post} /selfreport-symptom/create create self-report-symptom
     * @apiName CreateSelfReportingSymptom
     * @apiGroup Reporting
     *
     * @apiParam {String} idreport
     * @apiParam {String} idsymptom
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} message
     * @apiSuccess (Success 201) {Number} id of the created object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 OK
     *     {
     *       "success": true,
     *       "id":1,
     *       "message": "Successfully created."
     *     }
     */
    createSelfReportSymptom(req, res) {
        const {idreport, idsymptom} = req.body;
        try {
            SelfReporting_Symptom.create({
                idSelfReporting: idreport,
                idSymptom: idsymptom
            }).then((report) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    id: report.id
                });
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
                message: error.message || "Some error occurred while creating self-reports-symptom."
            });
        }
    },

    /**
     * @api {post} /selfreport-risk/create create self-report-risk
     * @apiName createSelfReportRisk
     * @apiGroup Reporting
     *
     * @apiParam {String} idreport
     * @apiParam {String} idrisque
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} message
     * @apiSuccess (Success 201) {Number} id of the created object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 OK
     *     {
     *       "success": true,
     *       "id":1,
     *       "message": "Successfully created."
     *     }
     */
    createSelfReportRisk(req, res) {
        const {idreport, idrisk} = req.body;
        try {
            SelfReporting_RiskFactor.create({
                idSelfReporting: idreport,
                idRiskFactor: idrisk
            }).then((report) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    id: report.id
                });
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
                message: error.message || "Some error occurred while creating self-reports-riskfactor."
            });
        }
    },

    /**
     * @api {get} /reporting/riskfactors get all risk-factor
     * @apiName getAllRiskFactor
     * @apiGroup Reporting
     *
     *
     * @apiSuccess (Success 200) {Object} result risk-factors list
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *          {
     *             "id": 2,
     *             "reportingDate": ,
     *             "idUser": ,
     *             "lat": "",
     *             "lng": ,
     *             "firstname": "",
     *             "lastname": "",
     *             "gender": "",
     *             "dateOfBirth": "",
     *             "age": ,
     *             "email": "",
     *             "adresse": "Ouakem",
     *             "department": "Dakar",
     *             "region": "Dakar",
     *             "createdAt": "2020-04-21T11:49:21.687Z",
     *             "updatedAt": "2020-04-21T11:49:21.687Z"
     *         }
     *
     *           ]
     *
     *
     *     }
     */
    getAllRiskFactors(req, res) {
        SelfReporting.findAll()
            .then(data => {
                res.send({
                    success: true,
                    code: 0,
                    resust: data,
                });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving RiskFactor."
                });
            });
    },
};