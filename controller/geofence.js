const { Geofence, User, ExitZone } = require('./../models');
const { insidePolygon } = require('geolocation-utils');

module.exports = {
    /**
     * @api {post} /geofence Add Zone for a person
     * @apiHeader {String} authorization User unique token
     * @apiName createGeofence
     * @apiGroup Geofence
     * @apiParam {Number} idUser numTel or IdUser
     * @apiParam {Date} start Date début 
     * @apiParam {Date} end Date fin 
     * @apiParam {String} polygon in the format lon,lat;lon,lat;lon,lat;lon,lat
     * @apiParam {idParent} Id zone parent
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
            end: req.body.end
        };
        sphone = cryptoUtil.getSID(idUser, process.env.JWT_SECRET);
        if (sphone !== "") {
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
        console.log("ID:" + idUser);

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
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /geofences zones list
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
            },{
                model: ExitZone
            }],
            order: [['createdAt', 'DESC']]
        }).then((zones) => {
            res.status(200).send({
                zones,
            });
        })
            .catch((error) => res.status(400).send(error));
    },


    /**
     * @api {get} /geofence/:id zone list
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
            },{
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

    /**
     * @api {get} /geofence/inside/:latitude/:longitude Inside zone
     * @apiHeader {String} authorization User unique token
     * @apiName isInGeofence
     * @apiGroup Geofence
     *
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
     *       "result":{
     * 
     *       }
     *          
     *       
     *     }
     */
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
        },{
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
     * @api {get} /geofence/user/:id zone list
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
    async getGeofenceUser(req, res) { 
        const { id } = req.params;
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
            },{
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
};