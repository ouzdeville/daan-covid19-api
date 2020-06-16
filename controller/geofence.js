const { Geofence, User, ExitZone } = require('./../models');
const { insidePolygon } = require('geolocation-utils');
const { cryptoUtil } = require('../utils');

module.exports = {
    /**
     * @api {post} /geofence Add Zone for a person
     * @apiHeader {String} authorization User unique token
     * @apiName createGeofence
     * @apiGroup Geofence
     * @apiParam {Number} idUser numTel or IdUser
     * @apiParam {Date} start Date  
     * @apiParam {Date} end Date 
     * @apiParam {Json} polygon in the format lon,lat;lon,lat;lon,lat;lon,lat
     * @apiParam {String} description Geofencing description
     *
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {Object} Zone a Zone object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created.",
     *       "zone":{ 
     *              id: '',
     *            }
     *     }
     */
    async createGeofence(req, res) {
        const data = {
            idUser: req.body.idUser,
            start: req.body.start,
            end: req.body.end,
            description: req.body.description,
            createdById: req.boUserID
        };
        sphone = cryptoUtil.getSID(data.idUser, process.env.JWT_SECRET);
        if (sphone !== "") {
            await User.findAll({
                where: {
                    phone: sphone,
                },
            }).then((users) => {
                if (users && users.length) {
                    data.idUser = users[0].id;
                }
            });
        }
        console.log("ID:" + data.idUser);

        //lon,lat;lon,lat;lon,lat;lon,lat
        const spolygone = req.body.polygon + '';

        data.poly = spolygone.split(";").map(function (lonlat) {
            return lonlat.split(",").map(e => parseFloat(e))
        });

        Geofence.create(data)
            .then((zone) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    zone: zone,
                });
            }).catch((error) => {
                console.log(error);
                res.status(500).send({
                    success: false,
                    code: -1,
                });
            });

    },

    /**
     * @api {get} /geofences All geofencing zones
     * @apiHeader {String} authorization User unique token
     * @apiName getGeofences
     * @apiGroup Geofence
     *
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *              {}
     *        ]
     *       
     *     }
     */
    async getGeofences(req, res) {
        Geofence.findAll({
            include: [{
                model: User
            }, {
                model: ExitZone
            }],
            order: [['createdAt', 'DESC']]
        }).then((zones) => {
            res.status(200).send({
                zones,
            });
        }).catch((error) => {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        });
    },


    /**
     * @api {get} /geofence/:id Get a GeoZone
     * @apiHeader {String} authorization User unique token
     * @apiName getGeofence
     * @apiGroup Geofence
     *
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *           ]
     *          
     *       
     *     }
     */
    async getGeofence(req, res) {
        const { id } = req.params;
        Geofence.findAll({
            where: {
                id: id
            },
            include: [{
                model: User
            }, {
                model: ExitZone
            }],
            order: [['createdAt', 'DESC']]
        })
            .then((zones) => {
                res.status(200).send({
                    zones,
                });
            })
            .catch((error) => res.status(400).send(error));
    },


    async isInGeofence(req, res) {
        let area = [];
        let { latitude, longitude } = req.params;
        // let location = [parseFloat(longitude),parseFloat(latitude)];
        let location = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        }
        //console.log(location);
        Geofence.findAll({
            model: User
        }, {
            model: ExitZone
        }).then((zones) => {
            zones.forEach(zone => {
                var poly = (zone.poly);
                //poly=JSON.parse(poly);
                rst = false;
                //console.log(poly);
                if (poly != null)
                    rst = insidePolygon(location, poly);
                if (rst) {
                    area.push(zone);
                }
            });
            res.status(200).send({ area, });

        }).catch((error) => console.log(error));
    },


    /**
     * @api {get} /geofence/user/:id Geofencing list
     * @apiHeader {String} authorization User unique token
     * @apiName getGeofenceUser
     * @apiGroup Geofence
     *
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *           ]
     *          
     *       
     *     }
     */
    async getGeofenceUser(req, res) {
        let { id } = req.params;
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
        Geofence.findAll({
            where: {
                idUser: id
            },
            include: [{
                model: User
            }, {
                limit: 1000,
                model: ExitZone
            }],
            order: [['createdAt', 'DESC']]
        })
            .then((zones) => {
                res.status(200).send({
                    zones,
                });
            })
            .catch((error) => {
                console.log(error);
                res.status(200).send({
                    success: false,
                    code: -1,
                    zones: []
                });
            });
    },

    /**
     * @api {Post} /geofence/update/:id Add Zone for a person
     * @apiHeader {String} authorization User unique token
     * @apiName updateGeofence
     * @apiGroup Geofence
     * @apiParam {Number} idUser numTel or IdUser
     * @apiParam {Date} start Date  
     * @apiParam {Date} end Date 
     * @apiParam {Json} polygon in the format lon,lat;lon,lat;lon,lat;lon,lat
     * @apiParam {String} description Geofencing description
     *
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {Object} Zone a Zone object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully updated.",
     *       "zone":{ 
     *              id: '',
     *            }
     *     }
     */
    async updateGeofence(req, res) {
        let { id } = req.params;
        const data = {
            idUser: req.body.idUser,
            start: req.body.start,
            end: req.body.end,
            description: req.body.description
        };
        sphone = cryptoUtil.getSID(data.idUser, process.env.JWT_SECRET);
        if (sphone !== "") {
            await User.findAll({
                where: {
                    phone: sphone,
                },
            }).then((users) => {
                if (users && users.length) {
                    data.idUser = users[0].id;
                }
            });
        }
        console.log("ID:" + data.idUser);

        //lon,lat;lon,lat;lon,lat;lon,lat
        const spolygone = req.body.polygon + '';

        data.poly = spolygone.split(";").map(function (lonlat) {
            return lonlat.split(",").map(e => parseFloat(e))
        });

        Geofence.update(data, {
            where: {
                id: id
            }

        }).then((zone) => {
            res.status(201).send({
                success: true,
                message: 'Successfully created.',
                zone: zone,
            });
        }).catch((error) => {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        });
    },

    /**
     * @api {Get} /geofence/notif All Exit notification
     * @apiHeader {String} authorization User unique token
     * @apiName GetNotif
     * @apiGroup Geofence
     *
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {Object} Zone a Zone object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully updated.",
     *       "zone":{ 
     *              id: '',
     *            }
     *     }
     */
    async getNotif(req, res) {

        
        
        Geofence.findAll({
            where: {
               createdById: req.boUserID
            },
            include: [ {
                limit: 1,
                model: ExitZone,
                where: {
                    notif: false
                }
            }],
            order: [['createdAt', 'DESC']]
        })
            .then((zones) => {
                res.status(200).send({
                    zones,
                });
            })
            .catch((error) => {
                console.log(error);
                res.status(200).send({
                    success: false,
                    code: -1,
                    zones: [],
                    error
                });
            });

    },


    /**
     * @api {Get} /geofence/updatenotif/:idExit Add Zone for a person
     * @apiHeader {String} authorization User unique token
     * @apiName updateExitZone
     * @apiGroup Geofence
     * @apiParam {Number} id ExitZone
     *
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {Object} Zone a Zone object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully updated.",
     *       "zone":{ 
     *              id: '',
     *            }
     *     }
     */
    async updateExitZone(req, res) {

        let { idExit } = req.params;
        ExitZone.update(data, {
            where: {
                id: idExit,
                notif: true
            }

        }).then((zone) => {
            res.status(201).send({
                success: true,
                message: 'Successfully updated.',
                zone: zone,
            });
        }).catch((error) => {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        });
    },
};