const { Zone } = require('./../models');
const { insidePolygon } = require('geolocation-utils');

module.exports = {
    createZone(req, res) {
        const data = {
            name: req.body.name,
            description: req.body.description,
            idParent: req.body.idParent,
            type: req.body.type,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        };

        //lat,lon;lat,lon;lat,lon;lat,lon
        const spolygone = req.body.polygon + '';

        data.polygon = spolygone.split(";").map(function (latlon) {
            return latlon.split(",").map(e => parseFloat(e))
        })

        if (data.idParent === '')
            data.idParent = null;

        Zone.create(data)
            .then((zone) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    zone: zone,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    getZones(req, res) {
        Zone.findAll()
            .then((zones) => {
                res.status(200).send({
                    zones,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    getZone(req, res) {
        const { id } = req.params;
        Zone.findAll({
            where: {
                id: id
            }
        })
            .then((zones) => {
                res.status(200).send({
                    zones,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /user/inside/:latitude/:longitude Inside zone
     * @apiHeader {String} authorization User unique token
     * @apiName isInAZoneElastic
     * @apiGroup Zone
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
     *          "zone": {
     *               "polygon": {
     *                   "type": "polygon",
     *                   "coordinates": [
     *                       [
     *                           [
     *                               -17.4962,
     *                               14.7007
     *                           ],
     *                           [
     *                               -17.4274,
     *                               14.7007
     *                           ],
     *                           [
     *                               -17.4274,
     *                               14.7535
     *                           ],
     *                           [
     *                               -17.4962,
     *                               14.7535
     *                           ],
     *                           [
     *                               -17.4962,
     *                               14.7007
     *                           ]
     *                       ]
     *                   ]
     *               },
     *               "name": "Dakar",
     *               "observation": "épicentre du pays"
     *           }
     * 
     *       }
     *          
     *       
     *     }
     */
    isInAZone(req, res) {
        let area = {};
        let { latitude, longitude } = req.params;
        let location = [parseFloat(latitude), parseFloat(longitude)];
        //console.log(location);
        Zone.findAll().then((zones) => {
            zones.forEach(zone => {
                var poly = (zone.polygon);
                //poly=JSON.parse(poly);
                rst = false;
                console.log(poly);
                if (poly != null)
                    rst = insidePolygon(location, poly);
                if (rst) {
                    area = zone;
                }
            });
            res.status(200).send({ area, });

        }).catch((error) => console.log(error));
    },
};