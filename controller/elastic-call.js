const {Incubation, User, Zone, Prevalence} = require('./../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {Client} = require('@elastic/elasticsearch')
const {elasticClient} = require('./../utils');
const {jwt, smsProviders} = require('./../providers');
const {cryptoUtil} = require('../utils');
const {insidePolygon} = require('geolocation-utils');
const moment = require('moment');
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
     *           ],
     *          "zones": [
     *               {
     *                   "id": "6e979c16-ec60-489d-97ac-0adc099d586a",
     *                   "name": "DAKAR-NORD",
     *                   "duration": 80  duration in minutes
     *               },
     *               {
     *                   "id": "77baa645-1143-48ca-b899-85c3230372e6",
     *                   "name": "DAKAR-OUEST",
     *                   "duration": 470
     *               },
     *               {
     *                   "id": "494d486d-e2f9-4425-846e-98400f75e144",
     *                   "name": "DAKAR-CENTRE",
     *                   "duration": 15
     *               }
     *           ]
     * 
     *
     *
     *     }
     */
    async getUserTrace(req, res) {
        console.log("#ELK_" + "getUserTrace");
        let id = req.params.id;
        let begin = req.params.begin;
        let end = req.params.end;
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
        console.log("ID:" + id);
        try {
            await elasticClient.getUserTrace(id, begin, end, function (result) {
                var i, j;
                zoneslist = [];
                Zone.findAll({
                    where: {
                        type: "DISTRICT"
                    }
                }).then((zones) => {
                    for (j = 0; j < zones.length; j++) {
                        area = {
                            id: zones[j].id,
                            name: zones[j].name,
                            type: zones[j].type,
                            duration: 0,
                            longitude: zones[j].longitude,
                            latitude: zones[j].latitude,
                            source: [],
                        };
                        for (i = 0; i < result.length; i++) {
                            var poly = (zones[j].polygon);

                            rst = false;

                            if (poly != null)
                                rst = insidePolygon(result[i]._source.position, poly);
                            if (rst) {
                                area.duration += 5;
                                area.source.push(result[i]);
                            }

                        }
                        if (0 < area.duration)
                            zoneslist.push(area);
                        if (j == zones.length - 1) {
                            res.status(200).send({
                                success: true,
                                code: 99,
                                resust: result,
                                zones: zoneslist
                            });
                        }
                    }


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

    async getUserTraceV2(req, res) {
        let {id, begin, end} = req.params;
        const sphone = cryptoUtil.getSID(id, process.env.JWT_SECRET);
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

        try {
            await elasticClient.getUserTrace(id, begin, end, function (result) {
                let r = result;
                let initenaires = [];
                let initenaire = [];

                r.forEach((e, idx) => {
                    let duration_since_last = (idx === 0) ? null : Math.round((e._source.created_date - r[idx - 1]._source.created_date) / 60000);

                    let elem = {
                        id: e._source.id,
                        created_date: new Date(e._source.created_date),
                        position: e._source.position,
                        duration_since_last: duration_since_last,
                    }

                    if (duration_since_last === null || duration_since_last < 10) {
                        initenaire.push(elem)
                    } else {
                        initenaires.push(initenaire);
                        initenaire = [elem]
                    }
                })

                let i, j;
                let zoneslist = [];

                Zone.findAll({
                    where: {
                        type: "DISTRICT"
                    }
                }).then((zones) => {
                    for (j = 0; j < zones.length; j++) {
                        let area = {
                            id: zones[j].id,
                            name: zones[j].name,
                            type: zones[j].type,
                            duration: 0
                        };
                        for (i = 0; i < result.length; i++) {
                            let poly = (zones[j].polygon);
                            //poly=JSON.parse(poly);
                            let rst = false;

                            if (poly != null)
                                rst = insidePolygon(result[i]._source.position, poly);
                            if (rst) {
                                area.duration += 5;
                            }
                        }
                        if (0 < area.duration)
                            zoneslist.push(area);
                        if (j === zones.length - 1) {
                            res.status(200).send({
                                success: true,
                                code: 99,
                                itineraires: initenaires,
                                zones: zoneslist
                            });
                        }
                    }
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
     * @api {get} /user/contact/:id/:begin/:end/:distance/:time Get all contacts by date
     * @apiHeader {String} authorization User unique token
     * @apiName getUserContacts
     * @apiGroup Contact
     *
     * @apiParam {Number} id User id
     * @apiParam {Date} begin date in format "yyyy-mm-dd"
     * @apiParam {Date} end date in format "yyyy-mm-dd"
     * @apiParam {Number} distance Number in meters
     * @apiParam {Number} time Number + or - time intervale
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
     *          "buckets": {
     *           "users": {
     *               "doc_count_error_upper_bound": 0,
     *               "sum_other_doc_count": 0,
     *               "buckets": [
     *                   {
     *                       "key": "ad1581a1-6af0-4814-8a53-56825777f40a",
     *                       "doc_count": 29
     *                   },
     *                   {
     *                       "key": "08795296-b702-4768-899b-f3e54bd3eed0",
     *                       "doc_count": 12
     *                   },
     *                   {
     *                       "key": "50665aa1-44fb-4a5c-a3eb-ecf70bb58cdf",
     *                       "doc_count": 2
     *                   },
     *                   {
     *                       "key": "08ba4fd2-ab07-4294-93e6-f649adee6cab",
     *                       "doc_count": 1
     *                   }
     *               ]
     *           }
     *       }
     *          
     *       
     *     }
     */
    async getUserContacts(req, res) {
        try {
            console.log("#ELK_GetUserContacts");
            let id = req.params.id;
            let begin = req.params.begin;
            let end = req.params.end;
            let distance = req.params.distance;
            let time = req.params.time;
            //begin = new Date(begin).getTime();
            //end = new Date(end).getTime();
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
            await elasticClient.getUserContactsNew(id, begin, end, distance, time, function (result, buckets) {
                console.log(buckets);
                res.status(200).send({
                    success: true,
                    code: 99,
                    resust: result,
                    buckets: buckets,
                });
            });
        } catch (error) {
            console.log("#ELK_" + error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        }
    },

    /**
     * @api {get} /user/scrollcontact/:id/:begin/:end/:distance/:time/:last_created_date Get all contacts after last_ceated_date
     * @apiHeader {String} authorization User unique token
     * @apiName getUserContacts
     * @apiGroup Contact
     *
     * @apiParam {Number} id User id
     * @apiParam {Date} begin date in format "yyyy-mm-dd"
     * @apiParam {Date} end date in format "yyyy-mm-dd"
     * @apiParam {Number} distance Number in meters
     * @apiParam {Number} time Number + or - time intervale
     * * @apiParam {Number} last_created_date last value of created_date for scrolling
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
     *          "buckets": {
     *           "users": {
     *               "doc_count_error_upper_bound": 0,
     *               "sum_other_doc_count": 0,
     *               "buckets": [
     *                   {
     *                       "key": "ad1581a1-6af0-4814-8a53-56825777f40a",
     *                       "doc_count": 29
     *                   },
     *                   {
     *                       "key": "08795296-b702-4768-899b-f3e54bd3eed0",
     *                       "doc_count": 12
     *                   },
     *                   {
     *                       "key": "50665aa1-44fb-4a5c-a3eb-ecf70bb58cdf",
     *                       "doc_count": 2
     *                   },
     *                   {
     *                       "key": "08ba4fd2-ab07-4294-93e6-f649adee6cab",
     *                       "doc_count": 1
     *                   }
     *               ]
     *           }
     *       }
     *          
     *       
     *     }
     */
    async ScrollUserContacts(req, res) {
        try {
            console.log("#ELK_ScrollUserContacts");
            let id = req.params.id;
            let begin = req.params.begin;
            let end = req.params.end;
            let distance = req.params.distance;
            let time = req.params.time;
            let last_created_date = req.params.last_created_date;
            //begin = new Date(begin).getTime();
            //end = new Date(end).getTime();
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
            await elasticClient.getUserContactsSearch_after(id, begin, end, distance, time, last_created_date, function (result, buckets) {
                console.log(buckets);
                res.status(200).send({
                    success: true,
                    code: 99,
                    resust: result,
                    buckets: buckets,
                });
            });
        } catch (error) {
            console.log("#ELK_" + error);
            res.status(500).send({
                success: false,
                code: -1,
                error: error
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
        let {latitude, longitude, created_date, id} = req.body;
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
            console.log("#ELK_" + error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        }
    },


    async isInAZoneElastic(req, res) {
        let area = {};
        const {latitude, longitude} = req.params;
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
            console.log("#ELK_" + error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        }
    },

    /**
     * @api {get} /user/incub/:id/:begin/:end/:distance/:time Infected Contacts
     * @apiHeader {String} authorization User unique token
     * @apiName getIncubContact
     * @apiGroup Contact
     *
     * @apiParam {Number} id User id
     * @apiParam {Date} begin date in format "yyyy-mm-dd"
     * @apiParam {Date} end date in format "yyyy-mm-dd"
     * @apiParam {Number} distance Number in meters
     * @apiParam {Number} time Number + or - time intervale
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
        let {idUser, begin, end} = req.params;
        let distance = req.params.distance;
        let time = req.params.time;
        begin = new Date(begin).getTime();
        end = new Date(end).getTime();
        sphone = cryptoUtil.getSID(idUser, process.env.JWT_SECRET);
        if (sphone != "") {
            await User.findAll({
                where: {
                    phone: sphone,
                },
            }).then((users) => {
                if (users && users.length) {
                    idUser = users[0].id;
                }
            });
        }
        try {
            //get all contacts first
            await elasticClient.getUserContactsNew(idUser, begin, end, distance, time, async function (result) {
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
            console.log("#ELK_" + error);
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
            console.log("#ELK_" + error);
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
            console.log("#ELK_" + error);
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
            const token = jwt.sign({phone: elem});
            console.log(token);
            list.push(token);
            if (ite === lists.length)
                res.status(200).send({
                    list,
                });
        });
    },

    async registerLocation(req, res) {
        const {userID} = req;
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
            console.log("#ELK_" + error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        }
    },

    async getAllTrace(req, res) {
        console.log("#ELK_" + "getALLTrace");
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
    },

    async getRiskLevel(req, res) {
        console.log("getRiskLevel");
        let id = req.params.id;
        let begin = await moment().add(-14, 'days').format("YYYY-MM-DD");
        let end = await moment().format("YYYY-MM-DD");
        console.log(begin);
        console.log(end);
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
        console.log("ID:" + id);
        try {
            await elasticClient.getUserTrace(id, begin, end, function (result) {
                if (result.length === 0) {
                    res.send({
                        riskLevel: "NO_EXPOSURE",
                        zoneslist: []
                    });
                } else {
                    var i, j;
                    zoneslist = [];
                    let riskRate = 0;
                    const BETA = 1.75;
                    const ALPHA = 0.50;
                    Zone.findAll({
                        where: {
                            type: "DISTRICT",
                            polygon: {
                                [Op.not]: null
                            }
                        },
                        // include: [{
                        //     model: Prevalence,
                        //     as: 'prevalences',
                        // }],
                    }).then(async (zones) => {
                        for (j = 0; j < zones.length; j++) {
                            let zone = zones[j];
                            let numberOfConfirmedCases = 0;
                            let area = {
                                id: zone.id,
                                name: zone.name,
                                type: zone.type,
                                men: zone.men,
                                women: zone.women,
                                area: zone.area,
                                duration: 0,
                                numberOfConfirmedCases: 0,
                                populationSize: 1,
                                densite: 0,
                                degreeOfExposure: 0,
                                zoneRiskLevel: 0,
                                riskRate: 0
                            };
                            if (area.men !== null)
                                area.populationSize += area.men;
                            if (area.women !== null)
                                area.populationSize += area.women;
                            if (area.area !== null)
                                area.densite = area.populationSize / area.area;

                            await Prevalence.findOne({
                                where: {
                                    idZone: zone.id
                                },
                                order: [['createdAt', 'DESC']]
                            }).then(prevalence => {
                                numberOfConfirmedCases = prevalence.numberOfConfirmedCases;

                                if (numberOfConfirmedCases !== null)
                                    area.numberOfConfirmedCases = numberOfConfirmedCases;
                                area.zoneRiskLevel = area.numberOfConfirmedCases / area.populationSize;
                            });

                            //poly=JSON.parse(poly);
                            var poly = zone.polygon;

                            if (poly !== null) {
                                for (i = 0; i < result.length; i++) {
                                    let rst = insidePolygon(result[i]._source.position, poly);

                                    if (rst) {
                                        area.duration += 5;
                                        area.degreeOfExposure += area.densite * 5;
                                        area.riskRate += area.zoneRiskLevel * area.densite * 5;
                                        riskRate += area.zoneRiskLevel * area.densite * 5;
                                        console.log(area.name + ":area.populationSize:" + area.populationSize);
                                        console.log(area.name + ":area.zoneRiskLevel:" + area.zoneRiskLevel);
                                        console.log(area.name + ":area.densite:" + area.densite);
                                        console.log(area.name + ":riskRate:" + riskRate);
                                    }
                                }
                            }

                            if (0 < area.duration)
                                zoneslist.push(area);
                            if (j === zones.length - 1) {
                                if (riskRate <= 0) {
                                    res.send({
                                        riskLevel: "NO_EXPOSURE",
                                        zoneslist: zoneslist
                                    });
                                } else if (riskRate <= ALPHA) {
                                    res.send({
                                        riskLevel: "LOW_EXPOSURE",
                                        zoneslist: zoneslist
                                    });
                                } else if (riskRate <= BETA) {
                                    res.send({
                                        riskLevel: "AVERAGE_EXPOSURE",
                                        zoneslist: zoneslist
                                    });
                                } else {
                                    res.send({
                                        riskLevel: "HIGH_EXPOSURE",
                                        zoneslist: zoneslist
                                    });
                                }
                            }
                        }
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

    async getRiskLevelV2(req, res) {
        console.log("getRiskLevelV2");
        let id = req.params.id;
        let end = await moment().format("YYYY-MM-DD");
        let begin = await moment().add(-14, 'days').format("YYYY-MM-DD");
        console.log(begin);
        console.log(end);
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
        console.log("ID:" + id);
        try {
            await elasticClient.getUserTrace(id, begin, end, function (result) {
                var i, j;
                zoneslist = [];
                let riskRate = 0;
                const BETA = 1.75;
                const ALPHA = 0.50;
                Zone.findAll().then(async (zones) => {
                    for (j = 0; j < zones.length; j++) {

                        let numberOfConfirmedCases = 0;
                        area = {
                            id: zones[j].id,
                            name: zones[j].name,
                            type: zones[j].type,
                            men: zones[j].men,
                            women: zones[j].women,
                            area: zones[j].area,
                            duration: 0,
                            numberOfConfirmedCases: 0,
                            populationSize: 1,
                            densite: 0,
                            degreeOfExposure: 0,
                            zoneRiskLevel: 0
                        };
                        if (area.men != null)
                            area.populationSize += area.men;
                        if (area.women != null)
                            area.populationSize += area.women;
                        if (zones[j].area != null)
                            area.densite = area.populationSize / zones[j].area;


                        await Prevalence.findOne({
                            where: {
                                idZone: zones[j].id
                            },
                            order: [['createdAt', 'DESC']]
                        }).then(prevalence => {
                            numberOfConfirmedCases = prevalence.numberOfConfirmedCases;

                            if (numberOfConfirmedCases != null)
                                area.numberOfConfirmedCases = numberOfConfirmedCases;
                            area.zoneRiskLevel = area.numberOfConfirmedCases / area.populationSize;


                        });

                        for (i = 0; i < result.length; i++) {
                            var poly = (zones[j].polygon);
                            //poly=JSON.parse(poly);
                            rst = false;
                            if (poly != null)
                                rst = insidePolygon(result[i]._source.position, poly);
                            if (rst) {

                                area.duration += 5;
                                area.degreeOfExposure += (area.densite) * 5;
                                riskRate += area.zoneRiskLevel * (area.densite) * 5;
                                console.log(zones[j].name + ":area.populationSize:" + area.populationSize);
                                console.log(zones[j].name + ":area.zoneRiskLevel:" + area.zoneRiskLevel);
                                console.log(zones[j].name + ":area.densite:" + area.densite);
                                console.log(zones[j].name + ":riskRate:" + riskRate);
                            }

                        }

                        if (j == zones.length - 1) {

                            if (riskRate <= 0) {
                                res.send({
                                    riskLevel: "NO_EXPOSURE"
                                });
                            } else if (riskRate <= ALPHA) {
                                res.send({
                                    riskLevel: "LOW_EXPOSURE"
                                });
                            } else if (riskRate <= BETA) {
                                res.send({
                                    riskLevel: "AVERAGE_EXPOSURE"
                                });
                            } else {
                                res.send({
                                    riskLevel: "HIGH_EXPOSURE"
                                });
                            }
                        }
                    }


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
}