const { Incubation, User } = require('./../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Client } = require('@elastic/elasticsearch')
const { elasticClient } = require('./../utils');
const { jwt, smsProviders } = require('./../providers');
const { cryptoUtil } = require('../utils');
//node: 'https://search-test-r7znlu2wprxosxw75c5veftgki.us-east-1.es.amazonaws.com' bamtu
//my host https://76fd57a0a1dd461ba279ef6aa16662b5.eu-west-2.aws.cloud.es.io:9243
const client = new Client({
    node: 'https://search-test-r7znlu2wprxosxw75c5veftgki.us-east-1.es.amazonaws.com',
    //auth: {
    //    username: '',
    //    password: ''
    //}
});

/**
 * User.
 * @module Geolocation Endpoints
 */

module.exports = {
    /**
     * @api {get} /user/trace/:id/:begin/:end Get historique
     * @apiHeader {String} authorization User unique token
     * @apiName getUserTrace
     * @apiGroup Contact
     *
     * @apiParam {Number} id User id
     * @apiParam {Date} begin date
     * @apiParam {Date} end date
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "resust":[
     *              {
     *                  "_index": "dc19",
     *                  "_type": "_doc",
     *                   "_id": "uYT5mXEB0m4T_0Lwe8LZ",
     *                   "_score": null,
     *                   "_source": {
     *                       "imei": "",
     *                       "position": {
     *                           "lat": 14.750403052963359,
     *                           "lon": -17.37935504970754
     *                       },
     *                       "status": "unknown",
     *                       "id": "dc0fc6c9-425d-4a23-89e1-ff238542a02e",
     *                       "created_date": 1586782662538
     *                   },
     *                   "sort": [
     *                       1586782662538
     *                   ]
     *               }
     *           ]
     *
     *
     *     }
     */

    async getUserTrace(req, res) {
        console.log("getUserTrace");
        let id = req.params.id;
        let begin = req.params.begin;
        let end = req.params.end;
        sphone = cryptoUtil.getSID(id, process.env.JWT_SECRET);
        if (sphone != "") {
            await User.findAll({
                where: {
                    phone: sphone,
                },
            }).then((users) => {
                if (users && users.length) {
                    id = users[0].id;
                }
            });
        }
        try {
            await elasticClient.getUserTrace(id, begin, end, function (result) {
                console.log(result);
                res.status(200).send({
                    success: true,
                    code: 99,
                    resust: result,
                });
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
     * @api {get} /user/contact/:id/:begin/:end/:precision Get all contacts by date
     * @apiHeader {String} authorization User unique token
     * @apiName getUserContacts
     * @apiGroup Contact
     *
     * @apiParam {Number} id User id
     * @apiParam {Date} begin date in format "yyyy-mm-dd"
     * @apiParam {Date} end date in format "yyyy-mm-dd"
     * @apiParam {Number} precision Number in meters 
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "resust":[
     *              {
     *                  "_index": "dc19",
     *                  "_type": "_doc",
     *                   "_id": "uYT5mXEB0m4T_0Lwe8LZ",
     *                   "_score": null,
     *                   "_source": {
     *                       "imei": "",
     *                       "position": {
     *                           "lat": 14.750403052963359,
     *                           "lon": -17.37935504970754
     *                       },
     *                       "status": "unknown",
     *                       "id": "dc0fc6c9-425d-4a23-89e1-ff238542a02e",
     *                       "created_date": 1586782662538
     *                   },
     *                   "sort": [
     *                       1586782662538
     *                   ]
     *               }
     *           ]
     *          
     *       
     *     }
     */
    async getUserContacts(req, res) {
        try {
            console.log("GetUserContacts");
            let id = req.params.id;
            let begin = req.params.begin;
            let end = req.params.end;
            let precision = req.params.precision;
            begin = new Date(begin).getTime();
            end = new Date(end).getTime();
            sphone = cryptoUtil.getSID(id, process.env.JWT_SECRET);
            if (sphone !== "") {
                await User.findAll({
                    where: {
                        phone: sphone,
                    },
                }).then((users) => {
                    if (users && users.length) {
                        id = users[0].id;
                    }
                });
            }
            //Let's search!
            //console.log("begin:" + begin);
            //console.log("end:" + end);
            await elasticClient.getUserContacts(id, begin, end, precision, function (result, buckets) {
                console.log(buckets);
                res.status(200).send({
                    success: true,
                    code: 99,
                    resust: result,
                    buckets: buckets,
                });
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
     * @api {post} /user/contact/position Get contacts at a Position
     * @apiHeader {String} authorization User unique token
     * @apiName getContactsAtPosition
     * @apiGroup Contact
     *
     * @apiParam {Number} id User id
     * @apiParam {Date} created_date date
     * @apiParam {Number} latitude GPS latitude
     * @apiParam {Number} longitude GPS longitude
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} result Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *              {
     *                  "_index": "dc19",
     *                  "_type": "_doc",
     *                   "_id": "uYT5mXEB0m4T_0Lwe8LZ",
     *                   "_score": null,
     *                   "_source": {
     *                       "imei": "",
     *                       "position": {
     *                           "lat": 14.750403052963359,
     *                           "lon": -17.37935504970754
     *                       },
     *                       "status": "unknown",
     *                       "id": "dc0fc6c9-425d-4a23-89e1-ff238542a02e",
     *                       "created_date": 1586782662538
     *                   },
     *                   "sort": [
     *                       1586782662538
     *                   ]
     *               }
     *           ]
     *          
     *       
     *     }
     */
    async getContactsAtPositionAndDate(req, res) {
        let { latitude, longitude, created_date, id } = req.body;
        sphone = cryptoUtil.getSID(id, process.env.JWT_SECRET);
        if (sphone != "") {
            await User.findAll({
                where: {
                    phone: sphone,
                },
            }).then((users) => {
                if (users && users.length) {
                    id = users[0].id;
                }
            });
        }
        try {
            await elasticClient.getContactsAtPositionAndDate(id, created_date, latitude, longitude, function (result) {
                console.log(result);
                res.status(200).send({
                    success: true,
                    code: 99,
                    resust: result,
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        }
    },


    async isInAZoneElastic(req, res) {
        let area = {};
        const { latitude, longitude } = req.params;
        try {
            await elasticClient.isInAZoneElastic(latitude, longitude, function (result) {
                console.log(result);
                res.status(200).send({
                    success: true,
                    code: 99,
                    resust: result,
                });
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
     * @api {get} /user/incub/:idUser/:begin/:end Infected Contacts
     * @apiHeader {String} authorization User unique token
     * @apiName getIncubContact
     * @apiGroup Contact
     *
     * @apiParam {Number} latitude GPS latitude
     * @apiParam {Number} longitude GPS longitude
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *              {
     *                  "_index": "dc19",
     *                  "_type": "_doc",
     *                   "_id": "uYT5mXEB0m4T_0Lwe8LZ",
     *                   "_score": null,
     *                   "_source": {
     *                       "imei": "",
     *                       "position": {
     *                           "lat": 14.750403052963359,
     *                           "lon": -17.37935504970754
     *                       },
     *                       "status": "unknown",
     *                       "id": "dc0fc6c9-425d-4a23-89e1-ff238542a02e",
     *                       "created_date": 1586782662538
     *                   },
     *                   "sort": [
     *                       1586782662538
     *                   ]
     *               }
     *           ]
     *          
     *       
     *     }
     */
    async getIncubContact(req, res) {
        let { idUser, begin, end } = req.params;
        sphone = cryptoUtil.getSID(idUser, process.env.JWT_SECRET);
        if (sphone != "") {
            await User.findAll({
                where: {
                    phone: sphone,
                },
            }).then((users) => {
                if (users && users.length) {
                    idUser=users[0].id;
                } 
            });
        }
        try {
            //get all contacts first
            await elasticClient.getUserContacts(idUser, begin, end, 2, async function (result) {
                var resultpositive = [];
                var counter = result.length;
                if (counter) {
                    await result.forEach(element => {
                        source = element._source;
                        source.created_date
                        source.id
                        Incubation.findAll({
                            where: {
                                idUser: source.id,
                                incubationStartedAt: {
                                    [Op.lte]: source.created_date
                                },
                                incubationEndedAt: {
                                    [Op.gte]: source.created_date
                                }
                            },
                        }).then((exist) => {
                            if (exist && !exist.length) {
                                resultpositive.push(element);
                            }
                        });
                        counter -= 1;
                        if (counter === 0) {
                            console.log(resultpositive);
                            res.status(200).send({
                                success: true,
                                code: 99,
                                resust: resultpositive,
                            });
                            return;
                        }
                    });
                } else {
                    res.status(200).send({
                        success: true,
                        code: 99,
                        resust: resultpositive,
                    });
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        }
    },


    async createZone(req, res) {
        const zone = req.body;
        //lat,lon;lat,lon;lat,lon;lat,lon
        console.log(zone);
        let polygon = [];
        const spolygone = zone.polygon + '';
        let latlons = spolygone.split(";");
        latlons.forEach(latlon => {
            position = latlon.split(",");
            const location = [parseFloat(position[1]), parseFloat(position[0])];
            if (location.length == 2)
                polygon.push(location);
        });
        const payload = {
            "zone": {
                "name": zone.name,
                "observation": zone.observation,
                "polygon": {
                    "type": "polygon",
                    "coordinates": [polygon]
                }

            }
        };
        zone.polygon = polygon;
        console.log(zone);
        try {
            //get all contacts first
            await elasticClient.createZone(payload, async function (resp) {
                res.status(200).send({
                    success: true,
                    code: 99,
                    resust: resp,
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        }
    },


    async getZones(req, res) {
        try {
            await elasticClient.getZones(async function (resp) {
                res.status(200).send({
                    success: true,
                    code: 99,
                    resust: resp,
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        }
    },

    gentoken(req, res) {
        let lists = ["000000000"];
        let list = [];
        let ite = 0;
        console.log(req.headers.authorization);
        lists.forEach((elem) => {
            ite++;
            const token = jwt.sign({ phone: elem });
            console.log(token);
            list.push(token);
            if (ite === lists.length)
                res.status(200).send({
                    list,
                });
        });
    },

    async registerLocation(req, res) {
        const { userID } = req;
        const payload = {
            id: userID, //SID
            imei: req.query.imei,
            created_date: req.query.timestamp,
            position: req.query.position,
            status: req.query.status || 'unknown'
        };
        // logs requests
        console.log(payload);
        try {
            //get all contacts first
            await elasticClient.createLocation(payload, async function (resp) {
                res.status(200).send({
                    success: true,
                    code: 99,
                    resust: resp,
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        }
    },

    async getAllTrace(req, res) {
        console.log("getALLTrace");
        // Let's search!
        try {
            await elasticClient.getAllTrace(function (result) {
                console.log(result);
                res.status(200).send({
                    success: true,
                    code: 99,
                    resust: result,
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        }
    },

    async sendsms(req, res) {
        await smsProviders.sendSms("+221776359893", `Bienvenue Ouz`);
    },
    getIdFromPhone(phone) {
        sphone = cryptoUtil.getSID(phone, process.env.JWT_SECRET);
        if (sphone != "") {
            User.findAll({
                where: {
                    phone: sphone,
                },
            }).then((users) => {
                console.log(users);
                if (users && users.length) {
                    return users[0].id;
                } else {
                    return phone;
                }
            });

        }
    }
}